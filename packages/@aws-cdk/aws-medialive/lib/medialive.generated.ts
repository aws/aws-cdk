// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:13.767Z","fingerprint":"eqgV4zLZZ1eTEfDov2ViJodos4ifdcLxJ82eBb7syms="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html
 */
export interface CfnChannelProps {

    /**
     * Specification of CDI inputs for this channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-cdiinputspecification
     */
    readonly cdiInputSpecification?: CfnChannel.CdiInputSpecificationProperty | cdk.IResolvable;

    /**
     * The class for this channel. For a channel with two pipelines, the class is STANDARD. For a channel with one pipeline, the class is SINGLE_PIPELINE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-channelclass
     */
    readonly channelClass?: string;

    /**
     * The settings that identify the destination for the outputs in this MediaLive output package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-destinations
     */
    readonly destinations?: Array<CfnChannel.OutputDestinationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The encoding configuration for the output content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-encodersettings
     */
    readonly encoderSettings?: CfnChannel.EncoderSettingsProperty | cdk.IResolvable;

    /**
     * The list of input attachments for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputattachments
     */
    readonly inputAttachments?: Array<CfnChannel.InputAttachmentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The input specification for this channel. It specifies the key characteristics of the inputs for this channel: the maximum bitrate, the resolution, and the codec.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputspecification
     */
    readonly inputSpecification?: CfnChannel.InputSpecificationProperty | cdk.IResolvable;

    /**
     * The verbosity for logging activity for this channel. Charges for logging (which are generated through Amazon CloudWatch Logging) are higher for higher verbosities.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-loglevel
     */
    readonly logLevel?: string;

    /**
     * A name for this audio selector. The AudioDescription (in an output) references this name in order to identify a specific input audio to include in that output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-name
     */
    readonly name?: string;

    /**
     * The IAM role for MediaLive to assume when running this channel. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-rolearn
     */
    readonly roleArn?: string;

    /**
     * A collection of tags for this channel. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-tags
     */
    readonly tags?: any;

    /**
     * Settings to enable VPC mode in the channel, so that the endpoints for all outputs are in your VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-vpc
     */
    readonly vpc?: CfnChannel.VpcOutputSettingsProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the result of the validation.
 */
function CfnChannelPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cdiInputSpecification', CfnChannel_CdiInputSpecificationPropertyValidator)(properties.cdiInputSpecification));
    errors.collect(cdk.propertyValidator('channelClass', cdk.validateString)(properties.channelClass));
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnChannel_OutputDestinationPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('encoderSettings', CfnChannel_EncoderSettingsPropertyValidator)(properties.encoderSettings));
    errors.collect(cdk.propertyValidator('inputAttachments', cdk.listValidator(CfnChannel_InputAttachmentPropertyValidator))(properties.inputAttachments));
    errors.collect(cdk.propertyValidator('inputSpecification', CfnChannel_InputSpecificationPropertyValidator)(properties.inputSpecification));
    errors.collect(cdk.propertyValidator('logLevel', cdk.validateString)(properties.logLevel));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('vpc', CfnChannel_VpcOutputSettingsPropertyValidator)(properties.vpc));
    return errors.wrap('supplied properties not correct for "CfnChannelProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel` resource
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel` resource.
 */
// @ts-ignore TS6133
function cfnChannelPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannelPropsValidator(properties).assertSuccess();
    return {
        CdiInputSpecification: cfnChannelCdiInputSpecificationPropertyToCloudFormation(properties.cdiInputSpecification),
        ChannelClass: cdk.stringToCloudFormation(properties.channelClass),
        Destinations: cdk.listMapper(cfnChannelOutputDestinationPropertyToCloudFormation)(properties.destinations),
        EncoderSettings: cfnChannelEncoderSettingsPropertyToCloudFormation(properties.encoderSettings),
        InputAttachments: cdk.listMapper(cfnChannelInputAttachmentPropertyToCloudFormation)(properties.inputAttachments),
        InputSpecification: cfnChannelInputSpecificationPropertyToCloudFormation(properties.inputSpecification),
        LogLevel: cdk.stringToCloudFormation(properties.logLevel),
        Name: cdk.stringToCloudFormation(properties.name),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Tags: cdk.objectToCloudFormation(properties.tags),
        Vpc: cfnChannelVpcOutputSettingsPropertyToCloudFormation(properties.vpc),
    };
}

// @ts-ignore TS6133
function CfnChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelProps>();
    ret.addPropertyResult('cdiInputSpecification', 'CdiInputSpecification', properties.CdiInputSpecification != null ? CfnChannelCdiInputSpecificationPropertyFromCloudFormation(properties.CdiInputSpecification) : undefined);
    ret.addPropertyResult('channelClass', 'ChannelClass', properties.ChannelClass != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelClass) : undefined);
    ret.addPropertyResult('destinations', 'Destinations', properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelOutputDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined);
    ret.addPropertyResult('encoderSettings', 'EncoderSettings', properties.EncoderSettings != null ? CfnChannelEncoderSettingsPropertyFromCloudFormation(properties.EncoderSettings) : undefined);
    ret.addPropertyResult('inputAttachments', 'InputAttachments', properties.InputAttachments != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelInputAttachmentPropertyFromCloudFormation)(properties.InputAttachments) : undefined);
    ret.addPropertyResult('inputSpecification', 'InputSpecification', properties.InputSpecification != null ? CfnChannelInputSpecificationPropertyFromCloudFormation(properties.InputSpecification) : undefined);
    ret.addPropertyResult('logLevel', 'LogLevel', properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('vpc', 'Vpc', properties.Vpc != null ? CfnChannelVpcOutputSettingsPropertyFromCloudFormation(properties.Vpc) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaLive::Channel`
 *
 * The AWS::MediaLive::Channel resource is a MediaLive resource type that creates a channel.
 *
 * A MediaLive channel ingests and transcodes (decodes and encodes) source content from the inputs that are attached to that channel, and packages the new content into outputs.
 *
 * @cloudformationResource AWS::MediaLive::Channel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::Channel";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnChannelPropsFromCloudFormation(resourceProperties);
        const ret = new CfnChannel(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the MediaLive channel. For example: arn:aws:medialive:us-west-1:111122223333:medialive:channel:1234567
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The inputs that are attached to this channel. The inputs are identified by their IDs (not by their names or their ARNs).
     * @cloudformationAttribute Inputs
     */
    public readonly attrInputs: string[];

    /**
     * Specification of CDI inputs for this channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-cdiinputspecification
     */
    public cdiInputSpecification: CfnChannel.CdiInputSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The class for this channel. For a channel with two pipelines, the class is STANDARD. For a channel with one pipeline, the class is SINGLE_PIPELINE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-channelclass
     */
    public channelClass: string | undefined;

    /**
     * The settings that identify the destination for the outputs in this MediaLive output package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-destinations
     */
    public destinations: Array<CfnChannel.OutputDestinationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The encoding configuration for the output content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-encodersettings
     */
    public encoderSettings: CfnChannel.EncoderSettingsProperty | cdk.IResolvable | undefined;

    /**
     * The list of input attachments for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputattachments
     */
    public inputAttachments: Array<CfnChannel.InputAttachmentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The input specification for this channel. It specifies the key characteristics of the inputs for this channel: the maximum bitrate, the resolution, and the codec.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputspecification
     */
    public inputSpecification: CfnChannel.InputSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The verbosity for logging activity for this channel. Charges for logging (which are generated through Amazon CloudWatch Logging) are higher for higher verbosities.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-loglevel
     */
    public logLevel: string | undefined;

    /**
     * A name for this audio selector. The AudioDescription (in an output) references this name in order to identify a specific input audio to include in that output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-name
     */
    public name: string | undefined;

    /**
     * The IAM role for MediaLive to assume when running this channel. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-rolearn
     */
    public roleArn: string | undefined;

    /**
     * A collection of tags for this channel. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Settings to enable VPC mode in the channel, so that the endpoints for all outputs are in your VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-vpc
     */
    public vpc: CfnChannel.VpcOutputSettingsProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::MediaLive::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnChannelProps = {}) {
        super(scope, id, { type: CfnChannel.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrInputs = cdk.Token.asList(this.getAtt('Inputs', cdk.ResolutionTypeHint.STRING_LIST));

        this.cdiInputSpecification = props.cdiInputSpecification;
        this.channelClass = props.channelClass;
        this.destinations = props.destinations;
        this.encoderSettings = props.encoderSettings;
        this.inputAttachments = props.inputAttachments;
        this.inputSpecification = props.inputSpecification;
        this.logLevel = props.logLevel;
        this.name = props.name;
        this.roleArn = props.roleArn;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MediaLive::Channel", props.tags, { tagPropertyName: 'tags' });
        this.vpc = props.vpc;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannel.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cdiInputSpecification: this.cdiInputSpecification,
            channelClass: this.channelClass,
            destinations: this.destinations,
            encoderSettings: this.encoderSettings,
            inputAttachments: this.inputAttachments,
            inputSpecification: this.inputSpecification,
            logLevel: this.logLevel,
            name: this.name,
            roleArn: this.roleArn,
            tags: this.tags.renderTags(),
            vpc: this.vpc,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnChannelPropsToCloudFormation(props);
    }
}

export namespace CfnChannel {
    /**
     * The settings for an AAC audio encode in the output.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html
     */
    export interface AacSettingsProperty {
        /**
         * The average bitrate in bits/second. Valid values depend on the rate control mode and profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-bitrate
         */
        readonly bitrate?: number;
        /**
         * Mono, stereo, or 5.1 channel layout. Valid values depend on the rate control mode and profile. The adReceiverMix setting receives a stereo description plus control track, and emits a mono AAC encode of the description track, with control data emitted in the PES header as per ETSI TS 101 154 Annex E.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-codingmode
         */
        readonly codingMode?: string;
        /**
         * Set to broadcasterMixedAd when the input contains pre-mixed main audio + AD (narration) as a stereo pair. The Audio Type field (audioType) will be set to 3, which signals to downstream systems that this stream contains broadcaster mixed AD. Note that the input received by the encoder must contain pre-mixed audio; MediaLive does not perform the mixing. The values in audioTypeControl and audioType (in AudioDescription) are ignored when set to broadcasterMixedAd. Leave this set to normal when the input does not contain pre-mixed audio + AD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-inputtype
         */
        readonly inputType?: string;
        /**
         * The AAC profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-profile
         */
        readonly profile?: string;
        /**
         * The rate control mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-ratecontrolmode
         */
        readonly rateControlMode?: string;
        /**
         * Sets the LATM/LOAS AAC output for raw containers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-rawformat
         */
        readonly rawFormat?: string;
        /**
         * The sample rate in Hz. Valid values depend on the rate control mode and profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-samplerate
         */
        readonly sampleRate?: number;
        /**
         * Uses MPEG-2 AAC audio instead of MPEG-4 AAC audio for raw or MPEG-2 Transport Stream containers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-spec
         */
        readonly spec?: string;
        /**
         * The VBR quality level. This is used only if rateControlMode is VBR.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aacsettings.html#cfn-medialive-channel-aacsettings-vbrquality
         */
        readonly vbrQuality?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AacSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AacSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AacSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('codingMode', cdk.validateString)(properties.codingMode));
    errors.collect(cdk.propertyValidator('inputType', cdk.validateString)(properties.inputType));
    errors.collect(cdk.propertyValidator('profile', cdk.validateString)(properties.profile));
    errors.collect(cdk.propertyValidator('rateControlMode', cdk.validateString)(properties.rateControlMode));
    errors.collect(cdk.propertyValidator('rawFormat', cdk.validateString)(properties.rawFormat));
    errors.collect(cdk.propertyValidator('sampleRate', cdk.validateNumber)(properties.sampleRate));
    errors.collect(cdk.propertyValidator('spec', cdk.validateString)(properties.spec));
    errors.collect(cdk.propertyValidator('vbrQuality', cdk.validateString)(properties.vbrQuality));
    return errors.wrap('supplied properties not correct for "AacSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AacSettings` resource
 *
 * @param properties - the TypeScript properties of a `AacSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AacSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAacSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AacSettingsPropertyValidator(properties).assertSuccess();
    return {
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        CodingMode: cdk.stringToCloudFormation(properties.codingMode),
        InputType: cdk.stringToCloudFormation(properties.inputType),
        Profile: cdk.stringToCloudFormation(properties.profile),
        RateControlMode: cdk.stringToCloudFormation(properties.rateControlMode),
        RawFormat: cdk.stringToCloudFormation(properties.rawFormat),
        SampleRate: cdk.numberToCloudFormation(properties.sampleRate),
        Spec: cdk.stringToCloudFormation(properties.spec),
        VbrQuality: cdk.stringToCloudFormation(properties.vbrQuality),
    };
}

// @ts-ignore TS6133
function CfnChannelAacSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AacSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AacSettingsProperty>();
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('codingMode', 'CodingMode', properties.CodingMode != null ? cfn_parse.FromCloudFormation.getString(properties.CodingMode) : undefined);
    ret.addPropertyResult('inputType', 'InputType', properties.InputType != null ? cfn_parse.FromCloudFormation.getString(properties.InputType) : undefined);
    ret.addPropertyResult('profile', 'Profile', properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined);
    ret.addPropertyResult('rateControlMode', 'RateControlMode', properties.RateControlMode != null ? cfn_parse.FromCloudFormation.getString(properties.RateControlMode) : undefined);
    ret.addPropertyResult('rawFormat', 'RawFormat', properties.RawFormat != null ? cfn_parse.FromCloudFormation.getString(properties.RawFormat) : undefined);
    ret.addPropertyResult('sampleRate', 'SampleRate', properties.SampleRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SampleRate) : undefined);
    ret.addPropertyResult('spec', 'Spec', properties.Spec != null ? cfn_parse.FromCloudFormation.getString(properties.Spec) : undefined);
    ret.addPropertyResult('vbrQuality', 'VbrQuality', properties.VbrQuality != null ? cfn_parse.FromCloudFormation.getString(properties.VbrQuality) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an AC3 audio encode in the output.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html
     */
    export interface Ac3SettingsProperty {
        /**
         * The average bitrate in bits/second. Valid bitrates depend on the coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-bitrate
         */
        readonly bitrate?: number;
        /**
         * Specifies the bitstream mode (bsmod) for the emitted AC-3 stream. For more information about these values, see ATSC A/52-2012.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-bitstreammode
         */
        readonly bitstreamMode?: string;
        /**
         * The Dolby Digital coding mode. This determines the number of channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-codingmode
         */
        readonly codingMode?: string;
        /**
         * Sets the dialnorm for the output. If excluded and the input audio is Dolby Digital, dialnorm is passed through.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-dialnorm
         */
        readonly dialnorm?: number;
        /**
         * If set to filmStandard, adds dynamic range compression signaling to the output bitstream as defined in the Dolby Digital specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-drcprofile
         */
        readonly drcProfile?: string;
        /**
         * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding. This is valid only in codingMode32Lfe mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-lfefilter
         */
        readonly lfeFilter?: string;
        /**
         * When set to followInput, encoder metadata is sourced from the DD, DD+, or DolbyE decoder that supplies this audio data. If the audio is supplied from one of these streams, the static metadata settings are used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ac3settings.html#cfn-medialive-channel-ac3settings-metadatacontrol
         */
        readonly metadataControl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Ac3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Ac3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Ac3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('bitstreamMode', cdk.validateString)(properties.bitstreamMode));
    errors.collect(cdk.propertyValidator('codingMode', cdk.validateString)(properties.codingMode));
    errors.collect(cdk.propertyValidator('dialnorm', cdk.validateNumber)(properties.dialnorm));
    errors.collect(cdk.propertyValidator('drcProfile', cdk.validateString)(properties.drcProfile));
    errors.collect(cdk.propertyValidator('lfeFilter', cdk.validateString)(properties.lfeFilter));
    errors.collect(cdk.propertyValidator('metadataControl', cdk.validateString)(properties.metadataControl));
    return errors.wrap('supplied properties not correct for "Ac3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Ac3Settings` resource
 *
 * @param properties - the TypeScript properties of a `Ac3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Ac3Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAc3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Ac3SettingsPropertyValidator(properties).assertSuccess();
    return {
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        BitstreamMode: cdk.stringToCloudFormation(properties.bitstreamMode),
        CodingMode: cdk.stringToCloudFormation(properties.codingMode),
        Dialnorm: cdk.numberToCloudFormation(properties.dialnorm),
        DrcProfile: cdk.stringToCloudFormation(properties.drcProfile),
        LfeFilter: cdk.stringToCloudFormation(properties.lfeFilter),
        MetadataControl: cdk.stringToCloudFormation(properties.metadataControl),
    };
}

// @ts-ignore TS6133
function CfnChannelAc3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Ac3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Ac3SettingsProperty>();
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('bitstreamMode', 'BitstreamMode', properties.BitstreamMode != null ? cfn_parse.FromCloudFormation.getString(properties.BitstreamMode) : undefined);
    ret.addPropertyResult('codingMode', 'CodingMode', properties.CodingMode != null ? cfn_parse.FromCloudFormation.getString(properties.CodingMode) : undefined);
    ret.addPropertyResult('dialnorm', 'Dialnorm', properties.Dialnorm != null ? cfn_parse.FromCloudFormation.getNumber(properties.Dialnorm) : undefined);
    ret.addPropertyResult('drcProfile', 'DrcProfile', properties.DrcProfile != null ? cfn_parse.FromCloudFormation.getString(properties.DrcProfile) : undefined);
    ret.addPropertyResult('lfeFilter', 'LfeFilter', properties.LfeFilter != null ? cfn_parse.FromCloudFormation.getString(properties.LfeFilter) : undefined);
    ret.addPropertyResult('metadataControl', 'MetadataControl', properties.MetadataControl != null ? cfn_parse.FromCloudFormation.getString(properties.MetadataControl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the ancillary captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ancillarysourcesettings.html
     */
    export interface AncillarySourceSettingsProperty {
        /**
         * Specifies the number (1 to 4) of the captions channel you want to extract from the ancillary captions. If you plan to convert the ancillary captions to another format, complete this field. If you plan to choose Embedded as the captions destination in the output (to pass through all the channels in the ancillary captions), leave this field blank because MediaLive ignores the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ancillarysourcesettings.html#cfn-medialive-channel-ancillarysourcesettings-sourceancillarychannelnumber
         */
        readonly sourceAncillaryChannelNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AncillarySourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AncillarySourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AncillarySourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('sourceAncillaryChannelNumber', cdk.validateNumber)(properties.sourceAncillaryChannelNumber));
    return errors.wrap('supplied properties not correct for "AncillarySourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AncillarySourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `AncillarySourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AncillarySourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAncillarySourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AncillarySourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        SourceAncillaryChannelNumber: cdk.numberToCloudFormation(properties.sourceAncillaryChannelNumber),
    };
}

// @ts-ignore TS6133
function CfnChannelAncillarySourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AncillarySourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AncillarySourceSettingsProperty>();
    ret.addPropertyResult('sourceAncillaryChannelNumber', 'SourceAncillaryChannelNumber', properties.SourceAncillaryChannelNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.SourceAncillaryChannelNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure the destination of an Archive output.
     *
     * The parent of this entity is ArchiveGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecdnsettings.html
     */
    export interface ArchiveCdnSettingsProperty {
        /**
         * Sets up Amazon S3 as the destination for this Archive output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecdnsettings.html#cfn-medialive-channel-archivecdnsettings-archives3settings
         */
        readonly archiveS3Settings?: CfnChannel.ArchiveS3SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveCdnSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveCdnSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ArchiveCdnSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('archiveS3Settings', CfnChannel_ArchiveS3SettingsPropertyValidator)(properties.archiveS3Settings));
    return errors.wrap('supplied properties not correct for "ArchiveCdnSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveCdnSettings` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveCdnSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveCdnSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelArchiveCdnSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ArchiveCdnSettingsPropertyValidator(properties).assertSuccess();
    return {
        ArchiveS3Settings: cfnChannelArchiveS3SettingsPropertyToCloudFormation(properties.archiveS3Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelArchiveCdnSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ArchiveCdnSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ArchiveCdnSettingsProperty>();
    ret.addPropertyResult('archiveS3Settings', 'ArchiveS3Settings', properties.ArchiveS3Settings != null ? CfnChannelArchiveS3SettingsPropertyFromCloudFormation(properties.ArchiveS3Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The archive container settings.
     *
     * The parent of this entity is ArchiveOutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecontainersettings.html
     */
    export interface ArchiveContainerSettingsProperty {
        /**
         * The settings for the M2TS in the archive output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecontainersettings.html#cfn-medialive-channel-archivecontainersettings-m2tssettings
         */
        readonly m2TsSettings?: CfnChannel.M2tsSettingsProperty | cdk.IResolvable;
        /**
         * The settings for Raw archive output type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecontainersettings.html#cfn-medialive-channel-archivecontainersettings-rawsettings
         */
        readonly rawSettings?: CfnChannel.RawSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveContainerSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveContainerSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ArchiveContainerSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('m2TsSettings', CfnChannel_M2tsSettingsPropertyValidator)(properties.m2TsSettings));
    errors.collect(cdk.propertyValidator('rawSettings', CfnChannel_RawSettingsPropertyValidator)(properties.rawSettings));
    return errors.wrap('supplied properties not correct for "ArchiveContainerSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveContainerSettings` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveContainerSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveContainerSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelArchiveContainerSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ArchiveContainerSettingsPropertyValidator(properties).assertSuccess();
    return {
        M2tsSettings: cfnChannelM2tsSettingsPropertyToCloudFormation(properties.m2TsSettings),
        RawSettings: cfnChannelRawSettingsPropertyToCloudFormation(properties.rawSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelArchiveContainerSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ArchiveContainerSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ArchiveContainerSettingsProperty>();
    ret.addPropertyResult('m2TsSettings', 'M2tsSettings', properties.M2tsSettings != null ? CfnChannelM2tsSettingsPropertyFromCloudFormation(properties.M2tsSettings) : undefined);
    ret.addPropertyResult('rawSettings', 'RawSettings', properties.RawSettings != null ? CfnChannelRawSettingsPropertyFromCloudFormation(properties.RawSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an archive output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivegroupsettings.html
     */
    export interface ArchiveGroupSettingsProperty {
        /**
         * Settings to configure the destination of an Archive output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivegroupsettings.html#cfn-medialive-channel-archivegroupsettings-archivecdnsettings
         */
        readonly archiveCdnSettings?: CfnChannel.ArchiveCdnSettingsProperty | cdk.IResolvable;
        /**
         * A directory and base file name where archive files should be written.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivegroupsettings.html#cfn-medialive-channel-archivegroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * The number of seconds to write to an archive file before closing and starting a new one.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivegroupsettings.html#cfn-medialive-channel-archivegroupsettings-rolloverinterval
         */
        readonly rolloverInterval?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ArchiveGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('archiveCdnSettings', CfnChannel_ArchiveCdnSettingsPropertyValidator)(properties.archiveCdnSettings));
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('rolloverInterval', cdk.validateNumber)(properties.rolloverInterval));
    return errors.wrap('supplied properties not correct for "ArchiveGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelArchiveGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ArchiveGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        ArchiveCdnSettings: cfnChannelArchiveCdnSettingsPropertyToCloudFormation(properties.archiveCdnSettings),
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        RolloverInterval: cdk.numberToCloudFormation(properties.rolloverInterval),
    };
}

// @ts-ignore TS6133
function CfnChannelArchiveGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ArchiveGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ArchiveGroupSettingsProperty>();
    ret.addPropertyResult('archiveCdnSettings', 'ArchiveCdnSettings', properties.ArchiveCdnSettings != null ? CfnChannelArchiveCdnSettingsPropertyFromCloudFormation(properties.ArchiveCdnSettings) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('rolloverInterval', 'RolloverInterval', properties.RolloverInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RolloverInterval) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The archive output settings.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archiveoutputsettings.html
     */
    export interface ArchiveOutputSettingsProperty {
        /**
         * The settings that are specific to the container type of the file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archiveoutputsettings.html#cfn-medialive-channel-archiveoutputsettings-containersettings
         */
        readonly containerSettings?: CfnChannel.ArchiveContainerSettingsProperty | cdk.IResolvable;
        /**
         * The output file extension. If excluded, this is auto-selected from the container type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archiveoutputsettings.html#cfn-medialive-channel-archiveoutputsettings-extension
         */
        readonly extension?: string;
        /**
         * A string that is concatenated to the end of the destination file name. The string is required for multiple outputs of the same type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archiveoutputsettings.html#cfn-medialive-channel-archiveoutputsettings-namemodifier
         */
        readonly nameModifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ArchiveOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('containerSettings', CfnChannel_ArchiveContainerSettingsPropertyValidator)(properties.containerSettings));
    errors.collect(cdk.propertyValidator('extension', cdk.validateString)(properties.extension));
    errors.collect(cdk.propertyValidator('nameModifier', cdk.validateString)(properties.nameModifier));
    return errors.wrap('supplied properties not correct for "ArchiveOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelArchiveOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ArchiveOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        ContainerSettings: cfnChannelArchiveContainerSettingsPropertyToCloudFormation(properties.containerSettings),
        Extension: cdk.stringToCloudFormation(properties.extension),
        NameModifier: cdk.stringToCloudFormation(properties.nameModifier),
    };
}

// @ts-ignore TS6133
function CfnChannelArchiveOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ArchiveOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ArchiveOutputSettingsProperty>();
    ret.addPropertyResult('containerSettings', 'ContainerSettings', properties.ContainerSettings != null ? CfnChannelArchiveContainerSettingsPropertyFromCloudFormation(properties.ContainerSettings) : undefined);
    ret.addPropertyResult('extension', 'Extension', properties.Extension != null ? cfn_parse.FromCloudFormation.getString(properties.Extension) : undefined);
    ret.addPropertyResult('nameModifier', 'NameModifier', properties.NameModifier != null ? cfn_parse.FromCloudFormation.getString(properties.NameModifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Sets up Amazon S3 as the destination for this Archive output.
     *
     * The parent of this entity is ArchiveCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archives3settings.html
     */
    export interface ArchiveS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archives3settings.html#cfn-medialive-channel-archives3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ArchiveS3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveS3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ArchiveS3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cannedAcl', cdk.validateString)(properties.cannedAcl));
    return errors.wrap('supplied properties not correct for "ArchiveS3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveS3Settings` resource
 *
 * @param properties - the TypeScript properties of a `ArchiveS3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ArchiveS3Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelArchiveS3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ArchiveS3SettingsPropertyValidator(properties).assertSuccess();
    return {
        CannedAcl: cdk.stringToCloudFormation(properties.cannedAcl),
    };
}

// @ts-ignore TS6133
function CfnChannelArchiveS3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ArchiveS3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ArchiveS3SettingsProperty>();
    ret.addPropertyResult('cannedAcl', 'CannedAcl', properties.CannedAcl != null ? cfn_parse.FromCloudFormation.getString(properties.CannedAcl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of ARIB captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aribdestinationsettings.html
     */
    export interface AribDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `AribDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AribDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AribDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "AribDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AribDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `AribDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AribDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAribDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AribDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelAribDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AribDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AribDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the ARIB captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-aribsourcesettings.html
     */
    export interface AribSourceSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `AribSourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AribSourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AribSourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "AribSourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AribSourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `AribSourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AribSourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAribSourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AribSourceSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelAribSourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AribSourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AribSourceSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for remixing audio.
     *
     * The parent of this entity is RemixSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiochannelmapping.html
     */
    export interface AudioChannelMappingProperty {
        /**
         * The indices and gain values for each input channel that should be remixed into this output channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiochannelmapping.html#cfn-medialive-channel-audiochannelmapping-inputchannellevels
         */
        readonly inputChannelLevels?: Array<CfnChannel.InputChannelLevelProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The index of the output channel that is being produced.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiochannelmapping.html#cfn-medialive-channel-audiochannelmapping-outputchannel
         */
        readonly outputChannel?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioChannelMappingProperty`
 *
 * @param properties - the TypeScript properties of a `AudioChannelMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioChannelMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputChannelLevels', cdk.listValidator(CfnChannel_InputChannelLevelPropertyValidator))(properties.inputChannelLevels));
    errors.collect(cdk.propertyValidator('outputChannel', cdk.validateNumber)(properties.outputChannel));
    return errors.wrap('supplied properties not correct for "AudioChannelMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioChannelMapping` resource
 *
 * @param properties - the TypeScript properties of a `AudioChannelMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioChannelMapping` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioChannelMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioChannelMappingPropertyValidator(properties).assertSuccess();
    return {
        InputChannelLevels: cdk.listMapper(cfnChannelInputChannelLevelPropertyToCloudFormation)(properties.inputChannelLevels),
        OutputChannel: cdk.numberToCloudFormation(properties.outputChannel),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioChannelMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioChannelMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioChannelMappingProperty>();
    ret.addPropertyResult('inputChannelLevels', 'InputChannelLevels', properties.InputChannelLevels != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelInputChannelLevelPropertyFromCloudFormation)(properties.InputChannelLevels) : undefined);
    ret.addPropertyResult('outputChannel', 'OutputChannel', properties.OutputChannel != null ? cfn_parse.FromCloudFormation.getNumber(properties.OutputChannel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of the audio codec in the audio output.
     *
     * The parent of this entity is AudioDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html
     */
    export interface AudioCodecSettingsProperty {
        /**
         * The setup of the AAC audio codec in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-aacsettings
         */
        readonly aacSettings?: CfnChannel.AacSettingsProperty | cdk.IResolvable;
        /**
         * The setup of an AC3 audio codec in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-ac3settings
         */
        readonly ac3Settings?: CfnChannel.Ac3SettingsProperty | cdk.IResolvable;
        /**
         * The setup of an EAC3 audio codec in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-eac3settings
         */
        readonly eac3Settings?: CfnChannel.Eac3SettingsProperty | cdk.IResolvable;
        /**
         * The setup of an MP2 audio codec in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-mp2settings
         */
        readonly mp2Settings?: CfnChannel.Mp2SettingsProperty | cdk.IResolvable;
        /**
         * The setup to pass through the Dolby audio codec to the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-passthroughsettings
         */
        readonly passThroughSettings?: CfnChannel.PassThroughSettingsProperty | cdk.IResolvable;
        /**
         * Settings for audio encoded with the WAV codec.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiocodecsettings.html#cfn-medialive-channel-audiocodecsettings-wavsettings
         */
        readonly wavSettings?: CfnChannel.WavSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioCodecSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioCodecSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioCodecSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aacSettings', CfnChannel_AacSettingsPropertyValidator)(properties.aacSettings));
    errors.collect(cdk.propertyValidator('ac3Settings', CfnChannel_Ac3SettingsPropertyValidator)(properties.ac3Settings));
    errors.collect(cdk.propertyValidator('eac3Settings', CfnChannel_Eac3SettingsPropertyValidator)(properties.eac3Settings));
    errors.collect(cdk.propertyValidator('mp2Settings', CfnChannel_Mp2SettingsPropertyValidator)(properties.mp2Settings));
    errors.collect(cdk.propertyValidator('passThroughSettings', CfnChannel_PassThroughSettingsPropertyValidator)(properties.passThroughSettings));
    errors.collect(cdk.propertyValidator('wavSettings', CfnChannel_WavSettingsPropertyValidator)(properties.wavSettings));
    return errors.wrap('supplied properties not correct for "AudioCodecSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioCodecSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioCodecSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioCodecSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioCodecSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioCodecSettingsPropertyValidator(properties).assertSuccess();
    return {
        AacSettings: cfnChannelAacSettingsPropertyToCloudFormation(properties.aacSettings),
        Ac3Settings: cfnChannelAc3SettingsPropertyToCloudFormation(properties.ac3Settings),
        Eac3Settings: cfnChannelEac3SettingsPropertyToCloudFormation(properties.eac3Settings),
        Mp2Settings: cfnChannelMp2SettingsPropertyToCloudFormation(properties.mp2Settings),
        PassThroughSettings: cfnChannelPassThroughSettingsPropertyToCloudFormation(properties.passThroughSettings),
        WavSettings: cfnChannelWavSettingsPropertyToCloudFormation(properties.wavSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioCodecSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioCodecSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioCodecSettingsProperty>();
    ret.addPropertyResult('aacSettings', 'AacSettings', properties.AacSettings != null ? CfnChannelAacSettingsPropertyFromCloudFormation(properties.AacSettings) : undefined);
    ret.addPropertyResult('ac3Settings', 'Ac3Settings', properties.Ac3Settings != null ? CfnChannelAc3SettingsPropertyFromCloudFormation(properties.Ac3Settings) : undefined);
    ret.addPropertyResult('eac3Settings', 'Eac3Settings', properties.Eac3Settings != null ? CfnChannelEac3SettingsPropertyFromCloudFormation(properties.Eac3Settings) : undefined);
    ret.addPropertyResult('mp2Settings', 'Mp2Settings', properties.Mp2Settings != null ? CfnChannelMp2SettingsPropertyFromCloudFormation(properties.Mp2Settings) : undefined);
    ret.addPropertyResult('passThroughSettings', 'PassThroughSettings', properties.PassThroughSettings != null ? CfnChannelPassThroughSettingsPropertyFromCloudFormation(properties.PassThroughSettings) : undefined);
    ret.addPropertyResult('wavSettings', 'WavSettings', properties.WavSettings != null ? CfnChannelWavSettingsPropertyFromCloudFormation(properties.WavSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The encoding information for one output audio.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html
     */
    export interface AudioDescriptionProperty {
        /**
         * The advanced audio normalization settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-audionormalizationsettings
         */
        readonly audioNormalizationSettings?: CfnChannel.AudioNormalizationSettingsProperty | cdk.IResolvable;
        /**
         * The name of the AudioSelector that is used as the source for this AudioDescription.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-audioselectorname
         */
        readonly audioSelectorName?: string;
        /**
         * Applies only if audioTypeControl is useConfigured. The values for audioType are defined in ISO-IEC 13818-1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-audiotype
         */
        readonly audioType?: string;
        /**
         * Determines how audio type is determined. followInput: If the input contains an ISO 639 audioType, then that value is passed through to the output. If the input contains no ISO 639 audioType, the value in Audio Type is included in the output. useConfigured: The value in Audio Type is included in the output. Note that this field and audioType are both ignored if inputType is broadcasterMixedAd.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-audiotypecontrol
         */
        readonly audioTypeControl?: string;
        /**
         * Settings to configure one or more solutions that insert audio watermarks in the audio encode
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-audiowatermarkingsettings
         */
        readonly audioWatermarkingSettings?: CfnChannel.AudioWatermarkSettingsProperty | cdk.IResolvable;
        /**
         * The audio codec settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-codecsettings
         */
        readonly codecSettings?: CfnChannel.AudioCodecSettingsProperty | cdk.IResolvable;
        /**
         * Indicates the language of the audio output track. Used only if languageControlMode is useConfigured, or there is no ISO 639 language code specified in the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-languagecode
         */
        readonly languageCode?: string;
        /**
         * Choosing followInput causes the ISO 639 language code of the output to follow the ISO 639 language code of the input. The languageCode setting is used when useConfigured is set, or when followInput is selected but there is no ISO 639 language code specified by the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-languagecodecontrol
         */
        readonly languageCodeControl?: string;
        /**
         * The name of this AudioDescription. Outputs use this name to uniquely identify this AudioDescription. Description names should be unique within this channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-name
         */
        readonly name?: string;
        /**
         * The settings that control how input audio channels are remixed into the output audio channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-remixsettings
         */
        readonly remixSettings?: CfnChannel.RemixSettingsProperty | cdk.IResolvable;
        /**
         * Used for Microsoft Smooth and Apple HLS outputs. Indicates the name displayed by the player (for example, English or Director Commentary).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiodescription.html#cfn-medialive-channel-audiodescription-streamname
         */
        readonly streamName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AudioDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `AudioDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioNormalizationSettings', CfnChannel_AudioNormalizationSettingsPropertyValidator)(properties.audioNormalizationSettings));
    errors.collect(cdk.propertyValidator('audioSelectorName', cdk.validateString)(properties.audioSelectorName));
    errors.collect(cdk.propertyValidator('audioType', cdk.validateString)(properties.audioType));
    errors.collect(cdk.propertyValidator('audioTypeControl', cdk.validateString)(properties.audioTypeControl));
    errors.collect(cdk.propertyValidator('audioWatermarkingSettings', CfnChannel_AudioWatermarkSettingsPropertyValidator)(properties.audioWatermarkingSettings));
    errors.collect(cdk.propertyValidator('codecSettings', CfnChannel_AudioCodecSettingsPropertyValidator)(properties.codecSettings));
    errors.collect(cdk.propertyValidator('languageCode', cdk.validateString)(properties.languageCode));
    errors.collect(cdk.propertyValidator('languageCodeControl', cdk.validateString)(properties.languageCodeControl));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('remixSettings', CfnChannel_RemixSettingsPropertyValidator)(properties.remixSettings));
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    return errors.wrap('supplied properties not correct for "AudioDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioDescription` resource
 *
 * @param properties - the TypeScript properties of a `AudioDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioDescription` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioDescriptionPropertyValidator(properties).assertSuccess();
    return {
        AudioNormalizationSettings: cfnChannelAudioNormalizationSettingsPropertyToCloudFormation(properties.audioNormalizationSettings),
        AudioSelectorName: cdk.stringToCloudFormation(properties.audioSelectorName),
        AudioType: cdk.stringToCloudFormation(properties.audioType),
        AudioTypeControl: cdk.stringToCloudFormation(properties.audioTypeControl),
        AudioWatermarkingSettings: cfnChannelAudioWatermarkSettingsPropertyToCloudFormation(properties.audioWatermarkingSettings),
        CodecSettings: cfnChannelAudioCodecSettingsPropertyToCloudFormation(properties.codecSettings),
        LanguageCode: cdk.stringToCloudFormation(properties.languageCode),
        LanguageCodeControl: cdk.stringToCloudFormation(properties.languageCodeControl),
        Name: cdk.stringToCloudFormation(properties.name),
        RemixSettings: cfnChannelRemixSettingsPropertyToCloudFormation(properties.remixSettings),
        StreamName: cdk.stringToCloudFormation(properties.streamName),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioDescriptionProperty>();
    ret.addPropertyResult('audioNormalizationSettings', 'AudioNormalizationSettings', properties.AudioNormalizationSettings != null ? CfnChannelAudioNormalizationSettingsPropertyFromCloudFormation(properties.AudioNormalizationSettings) : undefined);
    ret.addPropertyResult('audioSelectorName', 'AudioSelectorName', properties.AudioSelectorName != null ? cfn_parse.FromCloudFormation.getString(properties.AudioSelectorName) : undefined);
    ret.addPropertyResult('audioType', 'AudioType', properties.AudioType != null ? cfn_parse.FromCloudFormation.getString(properties.AudioType) : undefined);
    ret.addPropertyResult('audioTypeControl', 'AudioTypeControl', properties.AudioTypeControl != null ? cfn_parse.FromCloudFormation.getString(properties.AudioTypeControl) : undefined);
    ret.addPropertyResult('audioWatermarkingSettings', 'AudioWatermarkingSettings', properties.AudioWatermarkingSettings != null ? CfnChannelAudioWatermarkSettingsPropertyFromCloudFormation(properties.AudioWatermarkingSettings) : undefined);
    ret.addPropertyResult('codecSettings', 'CodecSettings', properties.CodecSettings != null ? CfnChannelAudioCodecSettingsPropertyFromCloudFormation(properties.CodecSettings) : undefined);
    ret.addPropertyResult('languageCode', 'LanguageCode', properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined);
    ret.addPropertyResult('languageCodeControl', 'LanguageCodeControl', properties.LanguageCodeControl != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCodeControl) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('remixSettings', 'RemixSettings', properties.RemixSettings != null ? CfnChannelRemixSettingsPropertyFromCloudFormation(properties.RemixSettings) : undefined);
    ret.addPropertyResult('streamName', 'StreamName', properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Selector for HLS audio rendition.
     *
     * The parent of this entity is AudioSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiohlsrenditionselection.html
     */
    export interface AudioHlsRenditionSelectionProperty {
        /**
         * Specifies the GROUP-ID in the #EXT-X-MEDIA tag of the target HLS audio rendition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiohlsrenditionselection.html#cfn-medialive-channel-audiohlsrenditionselection-groupid
         */
        readonly groupId?: string;
        /**
         * Specifies the NAME in the #EXT-X-MEDIA tag of the target HLS audio rendition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiohlsrenditionselection.html#cfn-medialive-channel-audiohlsrenditionselection-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AudioHlsRenditionSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `AudioHlsRenditionSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioHlsRenditionSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('groupId', cdk.validateString)(properties.groupId));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "AudioHlsRenditionSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioHlsRenditionSelection` resource
 *
 * @param properties - the TypeScript properties of a `AudioHlsRenditionSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioHlsRenditionSelection` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioHlsRenditionSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioHlsRenditionSelectionPropertyValidator(properties).assertSuccess();
    return {
        GroupId: cdk.stringToCloudFormation(properties.groupId),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioHlsRenditionSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioHlsRenditionSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioHlsRenditionSelectionProperty>();
    ret.addPropertyResult('groupId', 'GroupId', properties.GroupId != null ? cfn_parse.FromCloudFormation.getString(properties.GroupId) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the audio language to extract.
     *
     * The parent of this entity is AudioSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiolanguageselection.html
     */
    export interface AudioLanguageSelectionProperty {
        /**
         * Selects a specific three-letter language code from within an audio source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiolanguageselection.html#cfn-medialive-channel-audiolanguageselection-languagecode
         */
        readonly languageCode?: string;
        /**
         * When set to "strict," the transport stream demux strictly identifies audio streams by their language descriptor. If a PMT update occurs such that an audio stream matching the initially selected language is no longer present, then mute is encoded until the language returns. If set to "loose," then on a PMT update the demux chooses another audio stream in the program with the same stream type if it can't find one with the same language.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiolanguageselection.html#cfn-medialive-channel-audiolanguageselection-languageselectionpolicy
         */
        readonly languageSelectionPolicy?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AudioLanguageSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `AudioLanguageSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioLanguageSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('languageCode', cdk.validateString)(properties.languageCode));
    errors.collect(cdk.propertyValidator('languageSelectionPolicy', cdk.validateString)(properties.languageSelectionPolicy));
    return errors.wrap('supplied properties not correct for "AudioLanguageSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioLanguageSelection` resource
 *
 * @param properties - the TypeScript properties of a `AudioLanguageSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioLanguageSelection` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioLanguageSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioLanguageSelectionPropertyValidator(properties).assertSuccess();
    return {
        LanguageCode: cdk.stringToCloudFormation(properties.languageCode),
        LanguageSelectionPolicy: cdk.stringToCloudFormation(properties.languageSelectionPolicy),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioLanguageSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioLanguageSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioLanguageSelectionProperty>();
    ret.addPropertyResult('languageCode', 'LanguageCode', properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined);
    ret.addPropertyResult('languageSelectionPolicy', 'LanguageSelectionPolicy', properties.LanguageSelectionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageSelectionPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for normalizing video.
     *
     * The parent of this entity is AudioDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audionormalizationsettings.html
     */
    export interface AudioNormalizationSettingsProperty {
        /**
         * The audio normalization algorithm to use. itu17701 conforms to the CALM Act specification. itu17702 conforms to the EBU R-128 specification.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audionormalizationsettings.html#cfn-medialive-channel-audionormalizationsettings-algorithm
         */
        readonly algorithm?: string;
        /**
         * When set to correctAudio, the output audio is corrected using the chosen algorithm. If set to measureOnly, the audio is measured but not adjusted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audionormalizationsettings.html#cfn-medialive-channel-audionormalizationsettings-algorithmcontrol
         */
        readonly algorithmControl?: string;
        /**
         * The Target LKFS(loudness) to adjust volume to. If no value is entered, a default value is used according to the chosen algorithm. The CALM Act (1770-1) recommends a target of -24 LKFS. The EBU R-128 specification (1770-2) recommends a target of -23 LKFS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audionormalizationsettings.html#cfn-medialive-channel-audionormalizationsettings-targetlkfs
         */
        readonly targetLkfs?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioNormalizationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioNormalizationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioNormalizationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('algorithm', cdk.validateString)(properties.algorithm));
    errors.collect(cdk.propertyValidator('algorithmControl', cdk.validateString)(properties.algorithmControl));
    errors.collect(cdk.propertyValidator('targetLkfs', cdk.validateNumber)(properties.targetLkfs));
    return errors.wrap('supplied properties not correct for "AudioNormalizationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioNormalizationSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioNormalizationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioNormalizationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioNormalizationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioNormalizationSettingsPropertyValidator(properties).assertSuccess();
    return {
        Algorithm: cdk.stringToCloudFormation(properties.algorithm),
        AlgorithmControl: cdk.stringToCloudFormation(properties.algorithmControl),
        TargetLkfs: cdk.numberToCloudFormation(properties.targetLkfs),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioNormalizationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioNormalizationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioNormalizationSettingsProperty>();
    ret.addPropertyResult('algorithm', 'Algorithm', properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined);
    ret.addPropertyResult('algorithmControl', 'AlgorithmControl', properties.AlgorithmControl != null ? cfn_parse.FromCloudFormation.getString(properties.AlgorithmControl) : undefined);
    ret.addPropertyResult('targetLkfs', 'TargetLkfs', properties.TargetLkfs != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetLkfs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of an audio-only HLS output.
     *
     * The parent of this entity is HlsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioonlyhlssettings.html
     */
    export interface AudioOnlyHlsSettingsProperty {
        /**
         * Specifies the group that the audio rendition belongs to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioonlyhlssettings.html#cfn-medialive-channel-audioonlyhlssettings-audiogroupid
         */
        readonly audioGroupId?: string;
        /**
         * Used with an audio-only stream. It must be a .jpg or .png file. If given, this image is used as the cover art for the audio-only output. Ideally, it should be formatted for an iPhone screen for two reasons. The iPhone does not resize the image; instead, it crops a centered image on the top/bottom and left/right. Additionally, this image file gets saved bit-for-bit into every 10-second segment file, so it increases bandwidth by {image file size} * {segment count} * {user count.}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioonlyhlssettings.html#cfn-medialive-channel-audioonlyhlssettings-audioonlyimage
         */
        readonly audioOnlyImage?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Four types of audio-only tracks are supported: Audio-Only Variant Stream The client can play back this audio-only stream instead of video in low-bandwidth scenarios. Represented as an EXT-X-STREAM-INF in the HLS manifest. Alternate Audio, Auto Select, Default Alternate rendition that the client should try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=YES, AUTOSELECT=YES Alternate Audio, Auto Select, Not Default Alternate rendition that the client might try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=YES Alternate Audio, not Auto Select Alternate rendition that the client will not try to play back by default. Represented as an EXT-X-MEDIA in the HLS manifest with DEFAULT=NO, AUTOSELECT=NO.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioonlyhlssettings.html#cfn-medialive-channel-audioonlyhlssettings-audiotracktype
         */
        readonly audioTrackType?: string;
        /**
         * Specifies the segment type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioonlyhlssettings.html#cfn-medialive-channel-audioonlyhlssettings-segmenttype
         */
        readonly segmentType?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AudioOnlyHlsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioOnlyHlsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioOnlyHlsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioGroupId', cdk.validateString)(properties.audioGroupId));
    errors.collect(cdk.propertyValidator('audioOnlyImage', CfnChannel_InputLocationPropertyValidator)(properties.audioOnlyImage));
    errors.collect(cdk.propertyValidator('audioTrackType', cdk.validateString)(properties.audioTrackType));
    errors.collect(cdk.propertyValidator('segmentType', cdk.validateString)(properties.segmentType));
    return errors.wrap('supplied properties not correct for "AudioOnlyHlsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioOnlyHlsSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioOnlyHlsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioOnlyHlsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioOnlyHlsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioOnlyHlsSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioGroupId: cdk.stringToCloudFormation(properties.audioGroupId),
        AudioOnlyImage: cfnChannelInputLocationPropertyToCloudFormation(properties.audioOnlyImage),
        AudioTrackType: cdk.stringToCloudFormation(properties.audioTrackType),
        SegmentType: cdk.stringToCloudFormation(properties.segmentType),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioOnlyHlsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioOnlyHlsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioOnlyHlsSettingsProperty>();
    ret.addPropertyResult('audioGroupId', 'AudioGroupId', properties.AudioGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.AudioGroupId) : undefined);
    ret.addPropertyResult('audioOnlyImage', 'AudioOnlyImage', properties.AudioOnlyImage != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.AudioOnlyImage) : undefined);
    ret.addPropertyResult('audioTrackType', 'AudioTrackType', properties.AudioTrackType != null ? cfn_parse.FromCloudFormation.getString(properties.AudioTrackType) : undefined);
    ret.addPropertyResult('segmentType', 'SegmentType', properties.SegmentType != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentType) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Used to extract audio by The PID.
     *
     * The parent of this entity is AudioSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiopidselection.html
     */
    export interface AudioPidSelectionProperty {
        /**
         * Select the audio by this PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiopidselection.html#cfn-medialive-channel-audiopidselection-pid
         */
        readonly pid?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioPidSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `AudioPidSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioPidSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pid', cdk.validateNumber)(properties.pid));
    return errors.wrap('supplied properties not correct for "AudioPidSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioPidSelection` resource
 *
 * @param properties - the TypeScript properties of a `AudioPidSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioPidSelection` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioPidSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioPidSelectionPropertyValidator(properties).assertSuccess();
    return {
        Pid: cdk.numberToCloudFormation(properties.pid),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioPidSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioPidSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioPidSelectionProperty>();
    ret.addPropertyResult('pid', 'Pid', properties.Pid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Pid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about one audio to extract from the input.
     *
     * The parent of this entity is InputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselector.html
     */
    export interface AudioSelectorProperty {
        /**
         * A name for this AudioSelector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselector.html#cfn-medialive-channel-audioselector-name
         */
        readonly name?: string;
        /**
         * Information about the specific audio to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselector.html#cfn-medialive-channel-audioselector-selectorsettings
         */
        readonly selectorSettings?: CfnChannel.AudioSelectorSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `AudioSelectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioSelectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('selectorSettings', CfnChannel_AudioSelectorSettingsPropertyValidator)(properties.selectorSettings));
    return errors.wrap('supplied properties not correct for "AudioSelectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSelector` resource
 *
 * @param properties - the TypeScript properties of a `AudioSelectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSelector` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioSelectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioSelectorPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        SelectorSettings: cfnChannelAudioSelectorSettingsPropertyToCloudFormation(properties.selectorSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioSelectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioSelectorProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('selectorSettings', 'SelectorSettings', properties.SelectorSettings != null ? CfnChannelAudioSelectorSettingsPropertyFromCloudFormation(properties.SelectorSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the audio to extract from the input.
     *
     * The parent of this entity is AudioSelector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselectorsettings.html
     */
    export interface AudioSelectorSettingsProperty {
        /**
         * Selector for HLS audio rendition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselectorsettings.html#cfn-medialive-channel-audioselectorsettings-audiohlsrenditionselection
         */
        readonly audioHlsRenditionSelection?: CfnChannel.AudioHlsRenditionSelectionProperty | cdk.IResolvable;
        /**
         * The language code of the audio to select.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselectorsettings.html#cfn-medialive-channel-audioselectorsettings-audiolanguageselection
         */
        readonly audioLanguageSelection?: CfnChannel.AudioLanguageSelectionProperty | cdk.IResolvable;
        /**
         * The PID of the audio to select.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselectorsettings.html#cfn-medialive-channel-audioselectorsettings-audiopidselection
         */
        readonly audioPidSelection?: CfnChannel.AudioPidSelectionProperty | cdk.IResolvable;
        /**
         * Information about the audio track to extract.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audioselectorsettings.html#cfn-medialive-channel-audioselectorsettings-audiotrackselection
         */
        readonly audioTrackSelection?: CfnChannel.AudioTrackSelectionProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioSelectorSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioSelectorSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioSelectorSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioHlsRenditionSelection', CfnChannel_AudioHlsRenditionSelectionPropertyValidator)(properties.audioHlsRenditionSelection));
    errors.collect(cdk.propertyValidator('audioLanguageSelection', CfnChannel_AudioLanguageSelectionPropertyValidator)(properties.audioLanguageSelection));
    errors.collect(cdk.propertyValidator('audioPidSelection', CfnChannel_AudioPidSelectionPropertyValidator)(properties.audioPidSelection));
    errors.collect(cdk.propertyValidator('audioTrackSelection', CfnChannel_AudioTrackSelectionPropertyValidator)(properties.audioTrackSelection));
    return errors.wrap('supplied properties not correct for "AudioSelectorSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSelectorSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioSelectorSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSelectorSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioSelectorSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioSelectorSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioHlsRenditionSelection: cfnChannelAudioHlsRenditionSelectionPropertyToCloudFormation(properties.audioHlsRenditionSelection),
        AudioLanguageSelection: cfnChannelAudioLanguageSelectionPropertyToCloudFormation(properties.audioLanguageSelection),
        AudioPidSelection: cfnChannelAudioPidSelectionPropertyToCloudFormation(properties.audioPidSelection),
        AudioTrackSelection: cfnChannelAudioTrackSelectionPropertyToCloudFormation(properties.audioTrackSelection),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioSelectorSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioSelectorSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioSelectorSettingsProperty>();
    ret.addPropertyResult('audioHlsRenditionSelection', 'AudioHlsRenditionSelection', properties.AudioHlsRenditionSelection != null ? CfnChannelAudioHlsRenditionSelectionPropertyFromCloudFormation(properties.AudioHlsRenditionSelection) : undefined);
    ret.addPropertyResult('audioLanguageSelection', 'AudioLanguageSelection', properties.AudioLanguageSelection != null ? CfnChannelAudioLanguageSelectionPropertyFromCloudFormation(properties.AudioLanguageSelection) : undefined);
    ret.addPropertyResult('audioPidSelection', 'AudioPidSelection', properties.AudioPidSelection != null ? CfnChannelAudioPidSelectionPropertyFromCloudFormation(properties.AudioPidSelection) : undefined);
    ret.addPropertyResult('audioTrackSelection', 'AudioTrackSelection', properties.AudioTrackSelection != null ? CfnChannelAudioTrackSelectionPropertyFromCloudFormation(properties.AudioTrackSelection) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * MediaLive will perform a failover if audio is not detected in this input for the specified period.
     *
     * The parent of this entity is FailoverConditionSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiosilencefailoversettings.html
     */
    export interface AudioSilenceFailoverSettingsProperty {
        /**
         * The name of the audio selector in the input that MediaLive should monitor to detect silence. Select your most important rendition. If you didn't create an audio selector in this input, leave blank.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiosilencefailoversettings.html#cfn-medialive-channel-audiosilencefailoversettings-audioselectorname
         */
        readonly audioSelectorName?: string;
        /**
         * The amount of time (in milliseconds) that the active input must be silent before automatic input failover occurs. Silence is defined as audio loss or audio quieter than -50 dBFS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiosilencefailoversettings.html#cfn-medialive-channel-audiosilencefailoversettings-audiosilencethresholdmsec
         */
        readonly audioSilenceThresholdMsec?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioSilenceFailoverSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioSilenceFailoverSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioSilenceFailoverSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioSelectorName', cdk.validateString)(properties.audioSelectorName));
    errors.collect(cdk.propertyValidator('audioSilenceThresholdMsec', cdk.validateNumber)(properties.audioSilenceThresholdMsec));
    return errors.wrap('supplied properties not correct for "AudioSilenceFailoverSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSilenceFailoverSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioSilenceFailoverSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioSilenceFailoverSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioSilenceFailoverSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioSilenceFailoverSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioSelectorName: cdk.stringToCloudFormation(properties.audioSelectorName),
        AudioSilenceThresholdMsec: cdk.numberToCloudFormation(properties.audioSilenceThresholdMsec),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioSilenceFailoverSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioSilenceFailoverSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioSilenceFailoverSettingsProperty>();
    ret.addPropertyResult('audioSelectorName', 'AudioSelectorName', properties.AudioSelectorName != null ? cfn_parse.FromCloudFormation.getString(properties.AudioSelectorName) : undefined);
    ret.addPropertyResult('audioSilenceThresholdMsec', 'AudioSilenceThresholdMsec', properties.AudioSilenceThresholdMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.AudioSilenceThresholdMsec) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about one audio track to extract. You can select multiple tracks.
     *
     * The parent of this entity is AudioTrackSelection.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrack.html
     */
    export interface AudioTrackProperty {
        /**
         * 1-based integer value that maps to a specific audio track
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrack.html#cfn-medialive-channel-audiotrack-track
         */
        readonly track?: number;
    }
}

/**
 * Determine whether the given properties match those of a `AudioTrackProperty`
 *
 * @param properties - the TypeScript properties of a `AudioTrackProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioTrackPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('track', cdk.validateNumber)(properties.track));
    return errors.wrap('supplied properties not correct for "AudioTrackProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioTrack` resource
 *
 * @param properties - the TypeScript properties of a `AudioTrackProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioTrack` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioTrackPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioTrackPropertyValidator(properties).assertSuccess();
    return {
        Track: cdk.numberToCloudFormation(properties.track),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioTrackPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioTrackProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioTrackProperty>();
    ret.addPropertyResult('track', 'Track', properties.Track != null ? cfn_parse.FromCloudFormation.getNumber(properties.Track) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the audio track to extract.
     *
     * The parent of this entity is AudioSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrackselection.html
     */
    export interface AudioTrackSelectionProperty {
        /**
         * Selects one or more unique audio tracks from within a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrackselection.html#cfn-medialive-channel-audiotrackselection-tracks
         */
        readonly tracks?: Array<CfnChannel.AudioTrackProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioTrackSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `AudioTrackSelectionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioTrackSelectionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tracks', cdk.listValidator(CfnChannel_AudioTrackPropertyValidator))(properties.tracks));
    return errors.wrap('supplied properties not correct for "AudioTrackSelectionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioTrackSelection` resource
 *
 * @param properties - the TypeScript properties of a `AudioTrackSelectionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioTrackSelection` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioTrackSelectionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioTrackSelectionPropertyValidator(properties).assertSuccess();
    return {
        Tracks: cdk.listMapper(cfnChannelAudioTrackPropertyToCloudFormation)(properties.tracks),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioTrackSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioTrackSelectionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioTrackSelectionProperty>();
    ret.addPropertyResult('tracks', 'Tracks', properties.Tracks != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelAudioTrackPropertyFromCloudFormation)(properties.Tracks) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Audio Watermark Settings
     *
     * The parent of this entity is AudioDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiowatermarksettings.html
     */
    export interface AudioWatermarkSettingsProperty {
        /**
         * Settings to configure Nielsen Watermarks in the audio encode
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiowatermarksettings.html#cfn-medialive-channel-audiowatermarksettings-nielsenwatermarkssettings
         */
        readonly nielsenWatermarksSettings?: CfnChannel.NielsenWatermarksSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AudioWatermarkSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AudioWatermarkSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AudioWatermarkSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nielsenWatermarksSettings', CfnChannel_NielsenWatermarksSettingsPropertyValidator)(properties.nielsenWatermarksSettings));
    return errors.wrap('supplied properties not correct for "AudioWatermarkSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioWatermarkSettings` resource
 *
 * @param properties - the TypeScript properties of a `AudioWatermarkSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AudioWatermarkSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAudioWatermarkSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AudioWatermarkSettingsPropertyValidator(properties).assertSuccess();
    return {
        NielsenWatermarksSettings: cfnChannelNielsenWatermarksSettingsPropertyToCloudFormation(properties.nielsenWatermarksSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelAudioWatermarkSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AudioWatermarkSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AudioWatermarkSettingsProperty>();
    ret.addPropertyResult('nielsenWatermarksSettings', 'NielsenWatermarksSettings', properties.NielsenWatermarksSettings != null ? CfnChannelNielsenWatermarksSettingsPropertyFromCloudFormation(properties.NielsenWatermarksSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure the conditions that will define the input as unhealthy and that will make MediaLive fail over to the other input in the input failover pair.
     *
     * The parent of this entity is InputAttachment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-automaticinputfailoversettings.html
     */
    export interface AutomaticInputFailoverSettingsProperty {
        /**
         * This clear time defines the requirement a recovered input must meet to be considered healthy. The input must have no failover conditions for this length of time. Enter a time in milliseconds. This value is particularly important if the input_preference for the failover pair is set to PRIMARY_INPUT_PREFERRED, because after this time, MediaLive will switch back to the primary input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-automaticinputfailoversettings.html#cfn-medialive-channel-automaticinputfailoversettings-errorcleartimemsec
         */
        readonly errorClearTimeMsec?: number;
        /**
         * A list of failover conditions. If any of these conditions occur, MediaLive will perform a failover to the other input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-automaticinputfailoversettings.html#cfn-medialive-channel-automaticinputfailoversettings-failoverconditions
         */
        readonly failoverConditions?: Array<CfnChannel.FailoverConditionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Input preference when deciding which input to make active when a previously failed input has recovered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-automaticinputfailoversettings.html#cfn-medialive-channel-automaticinputfailoversettings-inputpreference
         */
        readonly inputPreference?: string;
        /**
         * The input ID of the secondary input in the automatic input failover pair.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-automaticinputfailoversettings.html#cfn-medialive-channel-automaticinputfailoversettings-secondaryinputid
         */
        readonly secondaryInputId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AutomaticInputFailoverSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AutomaticInputFailoverSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AutomaticInputFailoverSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('errorClearTimeMsec', cdk.validateNumber)(properties.errorClearTimeMsec));
    errors.collect(cdk.propertyValidator('failoverConditions', cdk.listValidator(CfnChannel_FailoverConditionPropertyValidator))(properties.failoverConditions));
    errors.collect(cdk.propertyValidator('inputPreference', cdk.validateString)(properties.inputPreference));
    errors.collect(cdk.propertyValidator('secondaryInputId', cdk.validateString)(properties.secondaryInputId));
    return errors.wrap('supplied properties not correct for "AutomaticInputFailoverSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AutomaticInputFailoverSettings` resource
 *
 * @param properties - the TypeScript properties of a `AutomaticInputFailoverSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AutomaticInputFailoverSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAutomaticInputFailoverSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AutomaticInputFailoverSettingsPropertyValidator(properties).assertSuccess();
    return {
        ErrorClearTimeMsec: cdk.numberToCloudFormation(properties.errorClearTimeMsec),
        FailoverConditions: cdk.listMapper(cfnChannelFailoverConditionPropertyToCloudFormation)(properties.failoverConditions),
        InputPreference: cdk.stringToCloudFormation(properties.inputPreference),
        SecondaryInputId: cdk.stringToCloudFormation(properties.secondaryInputId),
    };
}

// @ts-ignore TS6133
function CfnChannelAutomaticInputFailoverSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AutomaticInputFailoverSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AutomaticInputFailoverSettingsProperty>();
    ret.addPropertyResult('errorClearTimeMsec', 'ErrorClearTimeMsec', properties.ErrorClearTimeMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.ErrorClearTimeMsec) : undefined);
    ret.addPropertyResult('failoverConditions', 'FailoverConditions', properties.FailoverConditions != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelFailoverConditionPropertyFromCloudFormation)(properties.FailoverConditions) : undefined);
    ret.addPropertyResult('inputPreference', 'InputPreference', properties.InputPreference != null ? cfn_parse.FromCloudFormation.getString(properties.InputPreference) : undefined);
    ret.addPropertyResult('secondaryInputId', 'SecondaryInputId', properties.SecondaryInputId != null ? cfn_parse.FromCloudFormation.getString(properties.SecondaryInputId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of ad avail blanking in the output.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availblanking.html
     */
    export interface AvailBlankingProperty {
        /**
         * The blanking image to be used. Keep empty for solid black. Only .bmp and .png images are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availblanking.html#cfn-medialive-channel-availblanking-availblankingimage
         */
        readonly availBlankingImage?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * When set to enabled, the video, audio, and captions are blanked when insertion metadata is added.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availblanking.html#cfn-medialive-channel-availblanking-state
         */
        readonly state?: string;
    }
}

/**
 * Determine whether the given properties match those of a `AvailBlankingProperty`
 *
 * @param properties - the TypeScript properties of a `AvailBlankingProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AvailBlankingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availBlankingImage', CfnChannel_InputLocationPropertyValidator)(properties.availBlankingImage));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    return errors.wrap('supplied properties not correct for "AvailBlankingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailBlanking` resource
 *
 * @param properties - the TypeScript properties of a `AvailBlankingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailBlanking` resource.
 */
// @ts-ignore TS6133
function cfnChannelAvailBlankingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AvailBlankingPropertyValidator(properties).assertSuccess();
    return {
        AvailBlankingImage: cfnChannelInputLocationPropertyToCloudFormation(properties.availBlankingImage),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnChannelAvailBlankingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AvailBlankingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AvailBlankingProperty>();
    ret.addPropertyResult('availBlankingImage', 'AvailBlankingImage', properties.AvailBlankingImage != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.AvailBlankingImage) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setup of ad avail handling in the output.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availconfiguration.html
     */
    export interface AvailConfigurationProperty {
        /**
         * The setup of ad avail handling in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availconfiguration.html#cfn-medialive-channel-availconfiguration-availsettings
         */
        readonly availSettings?: CfnChannel.AvailSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AvailConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AvailConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AvailConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availSettings', CfnChannel_AvailSettingsPropertyValidator)(properties.availSettings));
    return errors.wrap('supplied properties not correct for "AvailConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `AvailConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnChannelAvailConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AvailConfigurationPropertyValidator(properties).assertSuccess();
    return {
        AvailSettings: cfnChannelAvailSettingsPropertyToCloudFormation(properties.availSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelAvailConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AvailConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AvailConfigurationProperty>();
    ret.addPropertyResult('availSettings', 'AvailSettings', properties.AvailSettings != null ? CfnChannelAvailSettingsPropertyFromCloudFormation(properties.AvailSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the ad avail setup in the output.
     *
     * The parent of this entity is AvailConfiguration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availsettings.html
     */
    export interface AvailSettingsProperty {
        /**
         * The setup for SCTE-35 splice insert handling.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availsettings.html#cfn-medialive-channel-availsettings-scte35spliceinsert
         */
        readonly scte35SpliceInsert?: CfnChannel.Scte35SpliceInsertProperty | cdk.IResolvable;
        /**
         * The setup for SCTE-35 time signal APOS handling.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availsettings.html#cfn-medialive-channel-availsettings-scte35timesignalapos
         */
        readonly scte35TimeSignalApos?: CfnChannel.Scte35TimeSignalAposProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `AvailSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `AvailSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_AvailSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('scte35SpliceInsert', CfnChannel_Scte35SpliceInsertPropertyValidator)(properties.scte35SpliceInsert));
    errors.collect(cdk.propertyValidator('scte35TimeSignalApos', CfnChannel_Scte35TimeSignalAposPropertyValidator)(properties.scte35TimeSignalApos));
    return errors.wrap('supplied properties not correct for "AvailSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailSettings` resource
 *
 * @param properties - the TypeScript properties of a `AvailSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.AvailSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelAvailSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_AvailSettingsPropertyValidator(properties).assertSuccess();
    return {
        Scte35SpliceInsert: cfnChannelScte35SpliceInsertPropertyToCloudFormation(properties.scte35SpliceInsert),
        Scte35TimeSignalApos: cfnChannelScte35TimeSignalAposPropertyToCloudFormation(properties.scte35TimeSignalApos),
    };
}

// @ts-ignore TS6133
function CfnChannelAvailSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.AvailSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.AvailSettingsProperty>();
    ret.addPropertyResult('scte35SpliceInsert', 'Scte35SpliceInsert', properties.Scte35SpliceInsert != null ? CfnChannelScte35SpliceInsertPropertyFromCloudFormation(properties.Scte35SpliceInsert) : undefined);
    ret.addPropertyResult('scte35TimeSignalApos', 'Scte35TimeSignalApos', properties.Scte35TimeSignalApos != null ? CfnChannelScte35TimeSignalAposPropertyFromCloudFormation(properties.Scte35TimeSignalApos) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a blackout slate.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html
     */
    export interface BlackoutSlateProperty {
        /**
         * The blackout slate image to be used. Keep empty for solid black. Only .bmp and .png images are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html#cfn-medialive-channel-blackoutslate-blackoutslateimage
         */
        readonly blackoutSlateImage?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Setting to enabled causes MediaLive to blackout the video, audio, and captions, and raise the "Network Blackout Image" slate when an SCTE104/35 Network End Segmentation Descriptor is encountered. The blackout is lifted when the Network Start Segmentation Descriptor is encountered. The Network End and Network Start descriptors must contain a network ID that matches the value entered in Network ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html#cfn-medialive-channel-blackoutslate-networkendblackout
         */
        readonly networkEndBlackout?: string;
        /**
         * The path to the local file to use as the Network End Blackout image. The image is scaled to fill the entire output raster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html#cfn-medialive-channel-blackoutslate-networkendblackoutimage
         */
        readonly networkEndBlackoutImage?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Provides a Network ID that matches EIDR ID format (for example, "10.XXXX/XXXX-XXXX-XXXX-XXXX-XXXX-C").
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html#cfn-medialive-channel-blackoutslate-networkid
         */
        readonly networkId?: string;
        /**
         * When set to enabled, this causes video, audio, and captions to be blanked when indicated by program metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-blackoutslate.html#cfn-medialive-channel-blackoutslate-state
         */
        readonly state?: string;
    }
}

/**
 * Determine whether the given properties match those of a `BlackoutSlateProperty`
 *
 * @param properties - the TypeScript properties of a `BlackoutSlateProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_BlackoutSlatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blackoutSlateImage', CfnChannel_InputLocationPropertyValidator)(properties.blackoutSlateImage));
    errors.collect(cdk.propertyValidator('networkEndBlackout', cdk.validateString)(properties.networkEndBlackout));
    errors.collect(cdk.propertyValidator('networkEndBlackoutImage', CfnChannel_InputLocationPropertyValidator)(properties.networkEndBlackoutImage));
    errors.collect(cdk.propertyValidator('networkId', cdk.validateString)(properties.networkId));
    errors.collect(cdk.propertyValidator('state', cdk.validateString)(properties.state));
    return errors.wrap('supplied properties not correct for "BlackoutSlateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.BlackoutSlate` resource
 *
 * @param properties - the TypeScript properties of a `BlackoutSlateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.BlackoutSlate` resource.
 */
// @ts-ignore TS6133
function cfnChannelBlackoutSlatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_BlackoutSlatePropertyValidator(properties).assertSuccess();
    return {
        BlackoutSlateImage: cfnChannelInputLocationPropertyToCloudFormation(properties.blackoutSlateImage),
        NetworkEndBlackout: cdk.stringToCloudFormation(properties.networkEndBlackout),
        NetworkEndBlackoutImage: cfnChannelInputLocationPropertyToCloudFormation(properties.networkEndBlackoutImage),
        NetworkId: cdk.stringToCloudFormation(properties.networkId),
        State: cdk.stringToCloudFormation(properties.state),
    };
}

// @ts-ignore TS6133
function CfnChannelBlackoutSlatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.BlackoutSlateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.BlackoutSlateProperty>();
    ret.addPropertyResult('blackoutSlateImage', 'BlackoutSlateImage', properties.BlackoutSlateImage != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.BlackoutSlateImage) : undefined);
    ret.addPropertyResult('networkEndBlackout', 'NetworkEndBlackout', properties.NetworkEndBlackout != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkEndBlackout) : undefined);
    ret.addPropertyResult('networkEndBlackoutImage', 'NetworkEndBlackoutImage', properties.NetworkEndBlackoutImage != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.NetworkEndBlackoutImage) : undefined);
    ret.addPropertyResult('networkId', 'NetworkId', properties.NetworkId != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkId) : undefined);
    ret.addPropertyResult('state', 'State', properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for burn-in captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html
     */
    export interface BurnInDestinationSettingsProperty {
        /**
         * If no explicit xPosition or yPosition is provided, setting alignment to centered places the captions at the bottom center of the output. Similarly, setting a left alignment aligns captions to the bottom left of the output. If x and y positions are specified in conjunction with the alignment parameter, the font is justified (either left or centered) relative to those coordinates. Selecting "smart" justification left-justifies live subtitles and center-justifies pre-recorded subtitles. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-alignment
         */
        readonly alignment?: string;
        /**
         * Specifies the color of the rectangle behind the captions. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * Specifies the opacity of the background rectangle. 255 is opaque; 0 is transparent. Keeping this parameter blank is equivalent to setting it to 0 (transparent). All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-backgroundopacity
         */
        readonly backgroundOpacity?: number;
        /**
         * The external font file that is used for captions burn-in. The file extension must be .ttf or .tte. Although you can select output fonts for many different types of input captions, embedded, STL, and Teletext sources use a strict grid system. Using external fonts with these captions sources could cause an unexpected display of proportional fonts. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-font
         */
        readonly font?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Specifies the color of the burned-in captions. This option is not valid for source captions that are STL, 608/embedded, or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-fontcolor
         */
        readonly fontColor?: string;
        /**
         * Specifies the opacity of the burned-in captions. 255 is opaque; 0 is transparent. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-fontopacity
         */
        readonly fontOpacity?: number;
        /**
         * The font resolution in DPI (dots per inch). The default is 96 dpi. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-fontresolution
         */
        readonly fontResolution?: number;
        /**
         * When set to auto, fontSize scales depending on the size of the output. Providing a positive integer specifies the exact font size in points. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-fontsize
         */
        readonly fontSize?: string;
        /**
         * Specifies the font outline color. This option is not valid for source captions that are either 608/embedded or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-outlinecolor
         */
        readonly outlineColor?: string;
        /**
         * Specifies font outline size in pixels. This option is not valid for source captions that are either 608/embedded or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-outlinesize
         */
        readonly outlineSize?: number;
        /**
         * Specifies the color of the shadow cast by the captions. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-shadowcolor
         */
        readonly shadowColor?: string;
        /**
         * Specifies the opacity of the shadow. 255 is opaque; 0 is transparent. Keeping this parameter blank is equivalent to setting it to 0 (transparent). All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-shadowopacity
         */
        readonly shadowOpacity?: number;
        /**
         * Specifies the horizontal offset of the shadow that is relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-shadowxoffset
         */
        readonly shadowXOffset?: number;
        /**
         * Specifies the vertical offset of the shadow that is relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-shadowyoffset
         */
        readonly shadowYOffset?: number;
        /**
         * Controls whether a fixed grid size is used to generate the output subtitles bitmap. This applies only to Teletext inputs and DVB-Sub/Burn-in outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-teletextgridcontrol
         */
        readonly teletextGridControl?: string;
        /**
         * Specifies the horizontal position of the captions relative to the left side of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the left of the output. If no explicit xPosition is provided, the horizontal captions position is determined by the alignment parameter. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-xposition
         */
        readonly xPosition?: number;
        /**
         * Specifies the vertical position of the captions relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit yPosition is provided, the captions are positioned towards the bottom of the output. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-burnindestinationsettings.html#cfn-medialive-channel-burnindestinationsettings-yposition
         */
        readonly yPosition?: number;
    }
}

/**
 * Determine whether the given properties match those of a `BurnInDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `BurnInDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_BurnInDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('backgroundOpacity', cdk.validateNumber)(properties.backgroundOpacity));
    errors.collect(cdk.propertyValidator('font', CfnChannel_InputLocationPropertyValidator)(properties.font));
    errors.collect(cdk.propertyValidator('fontColor', cdk.validateString)(properties.fontColor));
    errors.collect(cdk.propertyValidator('fontOpacity', cdk.validateNumber)(properties.fontOpacity));
    errors.collect(cdk.propertyValidator('fontResolution', cdk.validateNumber)(properties.fontResolution));
    errors.collect(cdk.propertyValidator('fontSize', cdk.validateString)(properties.fontSize));
    errors.collect(cdk.propertyValidator('outlineColor', cdk.validateString)(properties.outlineColor));
    errors.collect(cdk.propertyValidator('outlineSize', cdk.validateNumber)(properties.outlineSize));
    errors.collect(cdk.propertyValidator('shadowColor', cdk.validateString)(properties.shadowColor));
    errors.collect(cdk.propertyValidator('shadowOpacity', cdk.validateNumber)(properties.shadowOpacity));
    errors.collect(cdk.propertyValidator('shadowXOffset', cdk.validateNumber)(properties.shadowXOffset));
    errors.collect(cdk.propertyValidator('shadowYOffset', cdk.validateNumber)(properties.shadowYOffset));
    errors.collect(cdk.propertyValidator('teletextGridControl', cdk.validateString)(properties.teletextGridControl));
    errors.collect(cdk.propertyValidator('xPosition', cdk.validateNumber)(properties.xPosition));
    errors.collect(cdk.propertyValidator('yPosition', cdk.validateNumber)(properties.yPosition));
    return errors.wrap('supplied properties not correct for "BurnInDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.BurnInDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `BurnInDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.BurnInDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelBurnInDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_BurnInDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BackgroundOpacity: cdk.numberToCloudFormation(properties.backgroundOpacity),
        Font: cfnChannelInputLocationPropertyToCloudFormation(properties.font),
        FontColor: cdk.stringToCloudFormation(properties.fontColor),
        FontOpacity: cdk.numberToCloudFormation(properties.fontOpacity),
        FontResolution: cdk.numberToCloudFormation(properties.fontResolution),
        FontSize: cdk.stringToCloudFormation(properties.fontSize),
        OutlineColor: cdk.stringToCloudFormation(properties.outlineColor),
        OutlineSize: cdk.numberToCloudFormation(properties.outlineSize),
        ShadowColor: cdk.stringToCloudFormation(properties.shadowColor),
        ShadowOpacity: cdk.numberToCloudFormation(properties.shadowOpacity),
        ShadowXOffset: cdk.numberToCloudFormation(properties.shadowXOffset),
        ShadowYOffset: cdk.numberToCloudFormation(properties.shadowYOffset),
        TeletextGridControl: cdk.stringToCloudFormation(properties.teletextGridControl),
        XPosition: cdk.numberToCloudFormation(properties.xPosition),
        YPosition: cdk.numberToCloudFormation(properties.yPosition),
    };
}

// @ts-ignore TS6133
function CfnChannelBurnInDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.BurnInDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.BurnInDestinationSettingsProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('backgroundOpacity', 'BackgroundOpacity', properties.BackgroundOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackgroundOpacity) : undefined);
    ret.addPropertyResult('font', 'Font', properties.Font != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.Font) : undefined);
    ret.addPropertyResult('fontColor', 'FontColor', properties.FontColor != null ? cfn_parse.FromCloudFormation.getString(properties.FontColor) : undefined);
    ret.addPropertyResult('fontOpacity', 'FontOpacity', properties.FontOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.FontOpacity) : undefined);
    ret.addPropertyResult('fontResolution', 'FontResolution', properties.FontResolution != null ? cfn_parse.FromCloudFormation.getNumber(properties.FontResolution) : undefined);
    ret.addPropertyResult('fontSize', 'FontSize', properties.FontSize != null ? cfn_parse.FromCloudFormation.getString(properties.FontSize) : undefined);
    ret.addPropertyResult('outlineColor', 'OutlineColor', properties.OutlineColor != null ? cfn_parse.FromCloudFormation.getString(properties.OutlineColor) : undefined);
    ret.addPropertyResult('outlineSize', 'OutlineSize', properties.OutlineSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.OutlineSize) : undefined);
    ret.addPropertyResult('shadowColor', 'ShadowColor', properties.ShadowColor != null ? cfn_parse.FromCloudFormation.getString(properties.ShadowColor) : undefined);
    ret.addPropertyResult('shadowOpacity', 'ShadowOpacity', properties.ShadowOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowOpacity) : undefined);
    ret.addPropertyResult('shadowXOffset', 'ShadowXOffset', properties.ShadowXOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowXOffset) : undefined);
    ret.addPropertyResult('shadowYOffset', 'ShadowYOffset', properties.ShadowYOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowYOffset) : undefined);
    ret.addPropertyResult('teletextGridControl', 'TeletextGridControl', properties.TeletextGridControl != null ? cfn_parse.FromCloudFormation.getString(properties.TeletextGridControl) : undefined);
    ret.addPropertyResult('xPosition', 'XPosition', properties.XPosition != null ? cfn_parse.FromCloudFormation.getNumber(properties.XPosition) : undefined);
    ret.addPropertyResult('yPosition', 'YPosition', properties.YPosition != null ? cfn_parse.FromCloudFormation.getNumber(properties.YPosition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The encoding information for output captions.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html
     */
    export interface CaptionDescriptionProperty {
        /**
         * Specifies which input captions selector to use as a captions source when generating output captions. This field should match a captionSelector name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html#cfn-medialive-channel-captiondescription-captionselectorname
         */
        readonly captionSelectorName?: string;
        /**
         * Additional settings for a captions destination that depend on the destination type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html#cfn-medialive-channel-captiondescription-destinationsettings
         */
        readonly destinationSettings?: CfnChannel.CaptionDestinationSettingsProperty | cdk.IResolvable;
        /**
         * An ISO 639-2 three-digit code. For more information, see http://www.loc.gov/standards/iso639-2/.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html#cfn-medialive-channel-captiondescription-languagecode
         */
        readonly languageCode?: string;
        /**
         * Human-readable information to indicate the captions that are available for players (for example, English or Spanish).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html#cfn-medialive-channel-captiondescription-languagedescription
         */
        readonly languageDescription?: string;
        /**
         * The name of the captions description. The name is used to associate a captions description with an output. Names must be unique within a channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondescription.html#cfn-medialive-channel-captiondescription-name
         */
        readonly name?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('captionSelectorName', cdk.validateString)(properties.captionSelectorName));
    errors.collect(cdk.propertyValidator('destinationSettings', CfnChannel_CaptionDestinationSettingsPropertyValidator)(properties.destinationSettings));
    errors.collect(cdk.propertyValidator('languageCode', cdk.validateString)(properties.languageCode));
    errors.collect(cdk.propertyValidator('languageDescription', cdk.validateString)(properties.languageDescription));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "CaptionDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionDescription` resource
 *
 * @param properties - the TypeScript properties of a `CaptionDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionDescription` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionDescriptionPropertyValidator(properties).assertSuccess();
    return {
        CaptionSelectorName: cdk.stringToCloudFormation(properties.captionSelectorName),
        DestinationSettings: cfnChannelCaptionDestinationSettingsPropertyToCloudFormation(properties.destinationSettings),
        LanguageCode: cdk.stringToCloudFormation(properties.languageCode),
        LanguageDescription: cdk.stringToCloudFormation(properties.languageDescription),
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionDescriptionProperty>();
    ret.addPropertyResult('captionSelectorName', 'CaptionSelectorName', properties.CaptionSelectorName != null ? cfn_parse.FromCloudFormation.getString(properties.CaptionSelectorName) : undefined);
    ret.addPropertyResult('destinationSettings', 'DestinationSettings', properties.DestinationSettings != null ? CfnChannelCaptionDestinationSettingsPropertyFromCloudFormation(properties.DestinationSettings) : undefined);
    ret.addPropertyResult('languageCode', 'LanguageCode', properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined);
    ret.addPropertyResult('languageDescription', 'LanguageDescription', properties.LanguageDescription != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageDescription) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of one captions encode in the output.
     *
     * The parent of this entity is CaptionDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html
     */
    export interface CaptionDestinationSettingsProperty {
        /**
         * The configuration of one ARIB captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-aribdestinationsettings
         */
        readonly aribDestinationSettings?: CfnChannel.AribDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one burn-in captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-burnindestinationsettings
         */
        readonly burnInDestinationSettings?: CfnChannel.BurnInDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one DVB Sub captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-dvbsubdestinationsettings
         */
        readonly dvbSubDestinationSettings?: CfnChannel.DvbSubDestinationSettingsProperty | cdk.IResolvable;
        /**
         * Settings for EBU-TT captions in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-ebuttddestinationsettings
         */
        readonly ebuTtDDestinationSettings?: CfnChannel.EbuTtDDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one embedded captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-embeddeddestinationsettings
         */
        readonly embeddedDestinationSettings?: CfnChannel.EmbeddedDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one embedded plus SCTE-20 captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-embeddedplusscte20destinationsettings
         */
        readonly embeddedPlusScte20DestinationSettings?: CfnChannel.EmbeddedPlusScte20DestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one RTMPCaptionInfo captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-rtmpcaptioninfodestinationsettings
         */
        readonly rtmpCaptionInfoDestinationSettings?: CfnChannel.RtmpCaptionInfoDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one SCTE20 plus embedded captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-scte20plusembeddeddestinationsettings
         */
        readonly scte20PlusEmbeddedDestinationSettings?: CfnChannel.Scte20PlusEmbeddedDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one SCTE-27 captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-scte27destinationsettings
         */
        readonly scte27DestinationSettings?: CfnChannel.Scte27DestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one SMPTE-TT captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-smptettdestinationsettings
         */
        readonly smpteTtDestinationSettings?: CfnChannel.SmpteTtDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one Teletext captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-teletextdestinationsettings
         */
        readonly teletextDestinationSettings?: CfnChannel.TeletextDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one TTML captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-ttmldestinationsettings
         */
        readonly ttmlDestinationSettings?: CfnChannel.TtmlDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of one WebVTT captions encode in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captiondestinationsettings.html#cfn-medialive-channel-captiondestinationsettings-webvttdestinationsettings
         */
        readonly webvttDestinationSettings?: CfnChannel.WebvttDestinationSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('aribDestinationSettings', CfnChannel_AribDestinationSettingsPropertyValidator)(properties.aribDestinationSettings));
    errors.collect(cdk.propertyValidator('burnInDestinationSettings', CfnChannel_BurnInDestinationSettingsPropertyValidator)(properties.burnInDestinationSettings));
    errors.collect(cdk.propertyValidator('dvbSubDestinationSettings', CfnChannel_DvbSubDestinationSettingsPropertyValidator)(properties.dvbSubDestinationSettings));
    errors.collect(cdk.propertyValidator('ebuTtDDestinationSettings', CfnChannel_EbuTtDDestinationSettingsPropertyValidator)(properties.ebuTtDDestinationSettings));
    errors.collect(cdk.propertyValidator('embeddedDestinationSettings', CfnChannel_EmbeddedDestinationSettingsPropertyValidator)(properties.embeddedDestinationSettings));
    errors.collect(cdk.propertyValidator('embeddedPlusScte20DestinationSettings', CfnChannel_EmbeddedPlusScte20DestinationSettingsPropertyValidator)(properties.embeddedPlusScte20DestinationSettings));
    errors.collect(cdk.propertyValidator('rtmpCaptionInfoDestinationSettings', CfnChannel_RtmpCaptionInfoDestinationSettingsPropertyValidator)(properties.rtmpCaptionInfoDestinationSettings));
    errors.collect(cdk.propertyValidator('scte20PlusEmbeddedDestinationSettings', CfnChannel_Scte20PlusEmbeddedDestinationSettingsPropertyValidator)(properties.scte20PlusEmbeddedDestinationSettings));
    errors.collect(cdk.propertyValidator('scte27DestinationSettings', CfnChannel_Scte27DestinationSettingsPropertyValidator)(properties.scte27DestinationSettings));
    errors.collect(cdk.propertyValidator('smpteTtDestinationSettings', CfnChannel_SmpteTtDestinationSettingsPropertyValidator)(properties.smpteTtDestinationSettings));
    errors.collect(cdk.propertyValidator('teletextDestinationSettings', CfnChannel_TeletextDestinationSettingsPropertyValidator)(properties.teletextDestinationSettings));
    errors.collect(cdk.propertyValidator('ttmlDestinationSettings', CfnChannel_TtmlDestinationSettingsPropertyValidator)(properties.ttmlDestinationSettings));
    errors.collect(cdk.propertyValidator('webvttDestinationSettings', CfnChannel_WebvttDestinationSettingsPropertyValidator)(properties.webvttDestinationSettings));
    return errors.wrap('supplied properties not correct for "CaptionDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `CaptionDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        AribDestinationSettings: cfnChannelAribDestinationSettingsPropertyToCloudFormation(properties.aribDestinationSettings),
        BurnInDestinationSettings: cfnChannelBurnInDestinationSettingsPropertyToCloudFormation(properties.burnInDestinationSettings),
        DvbSubDestinationSettings: cfnChannelDvbSubDestinationSettingsPropertyToCloudFormation(properties.dvbSubDestinationSettings),
        EbuTtDDestinationSettings: cfnChannelEbuTtDDestinationSettingsPropertyToCloudFormation(properties.ebuTtDDestinationSettings),
        EmbeddedDestinationSettings: cfnChannelEmbeddedDestinationSettingsPropertyToCloudFormation(properties.embeddedDestinationSettings),
        EmbeddedPlusScte20DestinationSettings: cfnChannelEmbeddedPlusScte20DestinationSettingsPropertyToCloudFormation(properties.embeddedPlusScte20DestinationSettings),
        RtmpCaptionInfoDestinationSettings: cfnChannelRtmpCaptionInfoDestinationSettingsPropertyToCloudFormation(properties.rtmpCaptionInfoDestinationSettings),
        Scte20PlusEmbeddedDestinationSettings: cfnChannelScte20PlusEmbeddedDestinationSettingsPropertyToCloudFormation(properties.scte20PlusEmbeddedDestinationSettings),
        Scte27DestinationSettings: cfnChannelScte27DestinationSettingsPropertyToCloudFormation(properties.scte27DestinationSettings),
        SmpteTtDestinationSettings: cfnChannelSmpteTtDestinationSettingsPropertyToCloudFormation(properties.smpteTtDestinationSettings),
        TeletextDestinationSettings: cfnChannelTeletextDestinationSettingsPropertyToCloudFormation(properties.teletextDestinationSettings),
        TtmlDestinationSettings: cfnChannelTtmlDestinationSettingsPropertyToCloudFormation(properties.ttmlDestinationSettings),
        WebvttDestinationSettings: cfnChannelWebvttDestinationSettingsPropertyToCloudFormation(properties.webvttDestinationSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionDestinationSettingsProperty>();
    ret.addPropertyResult('aribDestinationSettings', 'AribDestinationSettings', properties.AribDestinationSettings != null ? CfnChannelAribDestinationSettingsPropertyFromCloudFormation(properties.AribDestinationSettings) : undefined);
    ret.addPropertyResult('burnInDestinationSettings', 'BurnInDestinationSettings', properties.BurnInDestinationSettings != null ? CfnChannelBurnInDestinationSettingsPropertyFromCloudFormation(properties.BurnInDestinationSettings) : undefined);
    ret.addPropertyResult('dvbSubDestinationSettings', 'DvbSubDestinationSettings', properties.DvbSubDestinationSettings != null ? CfnChannelDvbSubDestinationSettingsPropertyFromCloudFormation(properties.DvbSubDestinationSettings) : undefined);
    ret.addPropertyResult('ebuTtDDestinationSettings', 'EbuTtDDestinationSettings', properties.EbuTtDDestinationSettings != null ? CfnChannelEbuTtDDestinationSettingsPropertyFromCloudFormation(properties.EbuTtDDestinationSettings) : undefined);
    ret.addPropertyResult('embeddedDestinationSettings', 'EmbeddedDestinationSettings', properties.EmbeddedDestinationSettings != null ? CfnChannelEmbeddedDestinationSettingsPropertyFromCloudFormation(properties.EmbeddedDestinationSettings) : undefined);
    ret.addPropertyResult('embeddedPlusScte20DestinationSettings', 'EmbeddedPlusScte20DestinationSettings', properties.EmbeddedPlusScte20DestinationSettings != null ? CfnChannelEmbeddedPlusScte20DestinationSettingsPropertyFromCloudFormation(properties.EmbeddedPlusScte20DestinationSettings) : undefined);
    ret.addPropertyResult('rtmpCaptionInfoDestinationSettings', 'RtmpCaptionInfoDestinationSettings', properties.RtmpCaptionInfoDestinationSettings != null ? CfnChannelRtmpCaptionInfoDestinationSettingsPropertyFromCloudFormation(properties.RtmpCaptionInfoDestinationSettings) : undefined);
    ret.addPropertyResult('scte20PlusEmbeddedDestinationSettings', 'Scte20PlusEmbeddedDestinationSettings', properties.Scte20PlusEmbeddedDestinationSettings != null ? CfnChannelScte20PlusEmbeddedDestinationSettingsPropertyFromCloudFormation(properties.Scte20PlusEmbeddedDestinationSettings) : undefined);
    ret.addPropertyResult('scte27DestinationSettings', 'Scte27DestinationSettings', properties.Scte27DestinationSettings != null ? CfnChannelScte27DestinationSettingsPropertyFromCloudFormation(properties.Scte27DestinationSettings) : undefined);
    ret.addPropertyResult('smpteTtDestinationSettings', 'SmpteTtDestinationSettings', properties.SmpteTtDestinationSettings != null ? CfnChannelSmpteTtDestinationSettingsPropertyFromCloudFormation(properties.SmpteTtDestinationSettings) : undefined);
    ret.addPropertyResult('teletextDestinationSettings', 'TeletextDestinationSettings', properties.TeletextDestinationSettings != null ? CfnChannelTeletextDestinationSettingsPropertyFromCloudFormation(properties.TeletextDestinationSettings) : undefined);
    ret.addPropertyResult('ttmlDestinationSettings', 'TtmlDestinationSettings', properties.TtmlDestinationSettings != null ? CfnChannelTtmlDestinationSettingsPropertyFromCloudFormation(properties.TtmlDestinationSettings) : undefined);
    ret.addPropertyResult('webvttDestinationSettings', 'WebvttDestinationSettings', properties.WebvttDestinationSettings != null ? CfnChannelWebvttDestinationSettingsPropertyFromCloudFormation(properties.WebvttDestinationSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Maps a captions channel to an ISO 693-2 language code (http://www.loc.gov/standards/iso639-2), with an optional description.
     *
     * The parent of this entity is HlsGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionlanguagemapping.html
     */
    export interface CaptionLanguageMappingProperty {
        /**
         * The closed caption channel being described by this CaptionLanguageMapping. Each channel mapping must have a unique channel number (maximum of 4).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionlanguagemapping.html#cfn-medialive-channel-captionlanguagemapping-captionchannel
         */
        readonly captionChannel?: number;
        /**
         * A three-character ISO 639-2 language code (see http://www.loc.gov/standards/iso639-2).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionlanguagemapping.html#cfn-medialive-channel-captionlanguagemapping-languagecode
         */
        readonly languageCode?: string;
        /**
         * The textual description of language.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionlanguagemapping.html#cfn-medialive-channel-captionlanguagemapping-languagedescription
         */
        readonly languageDescription?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionLanguageMappingProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionLanguageMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionLanguageMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('captionChannel', cdk.validateNumber)(properties.captionChannel));
    errors.collect(cdk.propertyValidator('languageCode', cdk.validateString)(properties.languageCode));
    errors.collect(cdk.propertyValidator('languageDescription', cdk.validateString)(properties.languageDescription));
    return errors.wrap('supplied properties not correct for "CaptionLanguageMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionLanguageMapping` resource
 *
 * @param properties - the TypeScript properties of a `CaptionLanguageMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionLanguageMapping` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionLanguageMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionLanguageMappingPropertyValidator(properties).assertSuccess();
    return {
        CaptionChannel: cdk.numberToCloudFormation(properties.captionChannel),
        LanguageCode: cdk.stringToCloudFormation(properties.languageCode),
        LanguageDescription: cdk.stringToCloudFormation(properties.languageDescription),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionLanguageMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionLanguageMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionLanguageMappingProperty>();
    ret.addPropertyResult('captionChannel', 'CaptionChannel', properties.CaptionChannel != null ? cfn_parse.FromCloudFormation.getNumber(properties.CaptionChannel) : undefined);
    ret.addPropertyResult('languageCode', 'LanguageCode', properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined);
    ret.addPropertyResult('languageDescription', 'LanguageDescription', properties.LanguageDescription != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageDescription) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure the caption rectangle for an output captions that will be created using this Teletext source captions.
     *
     * The parent of this entity is TeletextSourceSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionrectangle.html
     */
    export interface CaptionRectangleProperty {
        /**
         * See the description in leftOffset.
         *
         * For height, specify the entire height of the rectangle as a percentage of the underlying frame height. For example, \"80\" means the rectangle height is 80% of the underlying frame height. The topOffset and rectangleHeight must add up to 100% or less. This field corresponds to tts:extent - Y in the TTML standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionrectangle.html#cfn-medialive-channel-captionrectangle-height
         */
        readonly height?: number;
        /**
         * Applies only if you plan to convert these source captions to EBU-TT-D or TTML in an output. (Make sure to leave the default if you don't have either of these formats in the output.) You can define a display rectangle for the captions that is smaller than the underlying video frame. You define the rectangle by specifying the position of the left edge, top edge, bottom edge, and right edge of the rectangle, all within the underlying video frame. The units for the measurements are percentages. If you specify a value for one of these fields, you must specify a value for all of them.
         *
         * For leftOffset, specify the position of the left edge of the rectangle, as a percentage of the underlying frame width, and relative to the left edge of the frame. For example, \"10\" means the measurement is 10% of the underlying frame width. The rectangle left edge starts at that position from the left edge of the frame. This field corresponds to tts:origin - X in the TTML standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionrectangle.html#cfn-medialive-channel-captionrectangle-leftoffset
         */
        readonly leftOffset?: number;
        /**
         * See the description in leftOffset.
         *
         * For topOffset, specify the position of the top edge of the rectangle, as a percentage of the underlying frame height, and relative to the top edge of the frame. For example, \"10\" means the measurement is 10% of the underlying frame height. The rectangle top edge starts at that position from the top edge of the frame. This field corresponds to tts:origin - Y in the TTML standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionrectangle.html#cfn-medialive-channel-captionrectangle-topoffset
         */
        readonly topOffset?: number;
        /**
         * See the description in leftOffset.
         *
         * For width, specify the entire width of the rectangle as a percentage of the underlying frame width. For example, \"80\" means the rectangle width is 80% of the underlying frame width. The leftOffset and rectangleWidth must add up to 100% or less. This field corresponds to tts:extent - X in the TTML standard.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionrectangle.html#cfn-medialive-channel-captionrectangle-width
         */
        readonly width?: number;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionRectangleProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionRectangleProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionRectanglePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('height', cdk.validateNumber)(properties.height));
    errors.collect(cdk.propertyValidator('leftOffset', cdk.validateNumber)(properties.leftOffset));
    errors.collect(cdk.propertyValidator('topOffset', cdk.validateNumber)(properties.topOffset));
    errors.collect(cdk.propertyValidator('width', cdk.validateNumber)(properties.width));
    return errors.wrap('supplied properties not correct for "CaptionRectangleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionRectangle` resource
 *
 * @param properties - the TypeScript properties of a `CaptionRectangleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionRectangle` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionRectanglePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionRectanglePropertyValidator(properties).assertSuccess();
    return {
        Height: cdk.numberToCloudFormation(properties.height),
        LeftOffset: cdk.numberToCloudFormation(properties.leftOffset),
        TopOffset: cdk.numberToCloudFormation(properties.topOffset),
        Width: cdk.numberToCloudFormation(properties.width),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionRectanglePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionRectangleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionRectangleProperty>();
    ret.addPropertyResult('height', 'Height', properties.Height != null ? cfn_parse.FromCloudFormation.getNumber(properties.Height) : undefined);
    ret.addPropertyResult('leftOffset', 'LeftOffset', properties.LeftOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.LeftOffset) : undefined);
    ret.addPropertyResult('topOffset', 'TopOffset', properties.TopOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.TopOffset) : undefined);
    ret.addPropertyResult('width', 'Width', properties.Width != null ? cfn_parse.FromCloudFormation.getNumber(properties.Width) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about one caption to extract from the input.
     *
     * The parent of this entity is InputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselector.html
     */
    export interface CaptionSelectorProperty {
        /**
         * When specified, this field indicates the three-letter language code of the captions track to extract from the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselector.html#cfn-medialive-channel-captionselector-languagecode
         */
        readonly languageCode?: string;
        /**
         * The name identifier for a captions selector. This name is used to associate this captions selector with one or more captions descriptions. Names must be unique within a channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselector.html#cfn-medialive-channel-captionselector-name
         */
        readonly name?: string;
        /**
         * Information about the specific audio to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselector.html#cfn-medialive-channel-captionselector-selectorsettings
         */
        readonly selectorSettings?: CfnChannel.CaptionSelectorSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionSelectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionSelectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('languageCode', cdk.validateString)(properties.languageCode));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('selectorSettings', CfnChannel_CaptionSelectorSettingsPropertyValidator)(properties.selectorSettings));
    return errors.wrap('supplied properties not correct for "CaptionSelectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionSelector` resource
 *
 * @param properties - the TypeScript properties of a `CaptionSelectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionSelector` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionSelectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionSelectorPropertyValidator(properties).assertSuccess();
    return {
        LanguageCode: cdk.stringToCloudFormation(properties.languageCode),
        Name: cdk.stringToCloudFormation(properties.name),
        SelectorSettings: cfnChannelCaptionSelectorSettingsPropertyToCloudFormation(properties.selectorSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionSelectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionSelectorProperty>();
    ret.addPropertyResult('languageCode', 'LanguageCode', properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('selectorSettings', 'SelectorSettings', properties.SelectorSettings != null ? CfnChannelCaptionSelectorSettingsPropertyFromCloudFormation(properties.SelectorSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Captions Selector Settings
     *
     * The parent of this entity is CaptionSelector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html
     */
    export interface CaptionSelectorSettingsProperty {
        /**
         * Information about the ancillary captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-ancillarysourcesettings
         */
        readonly ancillarySourceSettings?: CfnChannel.AncillarySourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the ARIB captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-aribsourcesettings
         */
        readonly aribSourceSettings?: CfnChannel.AribSourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the DVB Sub captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-dvbsubsourcesettings
         */
        readonly dvbSubSourceSettings?: CfnChannel.DvbSubSourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the embedded captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-embeddedsourcesettings
         */
        readonly embeddedSourceSettings?: CfnChannel.EmbeddedSourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the SCTE-20 captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-scte20sourcesettings
         */
        readonly scte20SourceSettings?: CfnChannel.Scte20SourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the SCTE-27 captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-scte27sourcesettings
         */
        readonly scte27SourceSettings?: CfnChannel.Scte27SourceSettingsProperty | cdk.IResolvable;
        /**
         * Information about the Teletext captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-captionselectorsettings.html#cfn-medialive-channel-captionselectorsettings-teletextsourcesettings
         */
        readonly teletextSourceSettings?: CfnChannel.TeletextSourceSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `CaptionSelectorSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `CaptionSelectorSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CaptionSelectorSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ancillarySourceSettings', CfnChannel_AncillarySourceSettingsPropertyValidator)(properties.ancillarySourceSettings));
    errors.collect(cdk.propertyValidator('aribSourceSettings', CfnChannel_AribSourceSettingsPropertyValidator)(properties.aribSourceSettings));
    errors.collect(cdk.propertyValidator('dvbSubSourceSettings', CfnChannel_DvbSubSourceSettingsPropertyValidator)(properties.dvbSubSourceSettings));
    errors.collect(cdk.propertyValidator('embeddedSourceSettings', CfnChannel_EmbeddedSourceSettingsPropertyValidator)(properties.embeddedSourceSettings));
    errors.collect(cdk.propertyValidator('scte20SourceSettings', CfnChannel_Scte20SourceSettingsPropertyValidator)(properties.scte20SourceSettings));
    errors.collect(cdk.propertyValidator('scte27SourceSettings', CfnChannel_Scte27SourceSettingsPropertyValidator)(properties.scte27SourceSettings));
    errors.collect(cdk.propertyValidator('teletextSourceSettings', CfnChannel_TeletextSourceSettingsPropertyValidator)(properties.teletextSourceSettings));
    return errors.wrap('supplied properties not correct for "CaptionSelectorSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionSelectorSettings` resource
 *
 * @param properties - the TypeScript properties of a `CaptionSelectorSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CaptionSelectorSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelCaptionSelectorSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CaptionSelectorSettingsPropertyValidator(properties).assertSuccess();
    return {
        AncillarySourceSettings: cfnChannelAncillarySourceSettingsPropertyToCloudFormation(properties.ancillarySourceSettings),
        AribSourceSettings: cfnChannelAribSourceSettingsPropertyToCloudFormation(properties.aribSourceSettings),
        DvbSubSourceSettings: cfnChannelDvbSubSourceSettingsPropertyToCloudFormation(properties.dvbSubSourceSettings),
        EmbeddedSourceSettings: cfnChannelEmbeddedSourceSettingsPropertyToCloudFormation(properties.embeddedSourceSettings),
        Scte20SourceSettings: cfnChannelScte20SourceSettingsPropertyToCloudFormation(properties.scte20SourceSettings),
        Scte27SourceSettings: cfnChannelScte27SourceSettingsPropertyToCloudFormation(properties.scte27SourceSettings),
        TeletextSourceSettings: cfnChannelTeletextSourceSettingsPropertyToCloudFormation(properties.teletextSourceSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelCaptionSelectorSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CaptionSelectorSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CaptionSelectorSettingsProperty>();
    ret.addPropertyResult('ancillarySourceSettings', 'AncillarySourceSettings', properties.AncillarySourceSettings != null ? CfnChannelAncillarySourceSettingsPropertyFromCloudFormation(properties.AncillarySourceSettings) : undefined);
    ret.addPropertyResult('aribSourceSettings', 'AribSourceSettings', properties.AribSourceSettings != null ? CfnChannelAribSourceSettingsPropertyFromCloudFormation(properties.AribSourceSettings) : undefined);
    ret.addPropertyResult('dvbSubSourceSettings', 'DvbSubSourceSettings', properties.DvbSubSourceSettings != null ? CfnChannelDvbSubSourceSettingsPropertyFromCloudFormation(properties.DvbSubSourceSettings) : undefined);
    ret.addPropertyResult('embeddedSourceSettings', 'EmbeddedSourceSettings', properties.EmbeddedSourceSettings != null ? CfnChannelEmbeddedSourceSettingsPropertyFromCloudFormation(properties.EmbeddedSourceSettings) : undefined);
    ret.addPropertyResult('scte20SourceSettings', 'Scte20SourceSettings', properties.Scte20SourceSettings != null ? CfnChannelScte20SourceSettingsPropertyFromCloudFormation(properties.Scte20SourceSettings) : undefined);
    ret.addPropertyResult('scte27SourceSettings', 'Scte27SourceSettings', properties.Scte27SourceSettings != null ? CfnChannelScte27SourceSettingsPropertyFromCloudFormation(properties.Scte27SourceSettings) : undefined);
    ret.addPropertyResult('teletextSourceSettings', 'TeletextSourceSettings', properties.TeletextSourceSettings != null ? CfnChannelTeletextSourceSettingsPropertyFromCloudFormation(properties.TeletextSourceSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The input specification for this channel. It specifies the key characteristics of CDI inputs for this channel, when those characteristics are different from other inputs.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-cdiinputspecification.html
     */
    export interface CdiInputSpecificationProperty {
        /**
         * Maximum CDI input resolution
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-cdiinputspecification.html#cfn-medialive-channel-cdiinputspecification-resolution
         */
        readonly resolution?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CdiInputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `CdiInputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_CdiInputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resolution', cdk.validateString)(properties.resolution));
    return errors.wrap('supplied properties not correct for "CdiInputSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CdiInputSpecification` resource
 *
 * @param properties - the TypeScript properties of a `CdiInputSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.CdiInputSpecification` resource.
 */
// @ts-ignore TS6133
function cfnChannelCdiInputSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_CdiInputSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Resolution: cdk.stringToCloudFormation(properties.resolution),
    };
}

// @ts-ignore TS6133
function CfnChannelCdiInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CdiInputSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CdiInputSpecificationProperty>();
    ret.addPropertyResult('resolution', 'Resolution', properties.Resolution != null ? cfn_parse.FromCloudFormation.getString(properties.Resolution) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Passthrough applies no color space conversion to the output.
     *
     * The parents of this entity are H264ColorSpaceSettings and H265ColorSpaceSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-colorspacepassthroughsettings.html
     */
    export interface ColorSpacePassthroughSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `ColorSpacePassthroughSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ColorSpacePassthroughSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_ColorSpacePassthroughSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "ColorSpacePassthroughSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ColorSpacePassthroughSettings` resource
 *
 * @param properties - the TypeScript properties of a `ColorSpacePassthroughSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.ColorSpacePassthroughSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelColorSpacePassthroughSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_ColorSpacePassthroughSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelColorSpacePassthroughSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ColorSpacePassthroughSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ColorSpacePassthroughSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of DVB NIT.
     *
     * The parent of this entity is M2tsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbnitsettings.html
     */
    export interface DvbNitSettingsProperty {
        /**
         * The numeric value placed in the Network Information Table (NIT).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbnitsettings.html#cfn-medialive-channel-dvbnitsettings-networkid
         */
        readonly networkId?: number;
        /**
         * The network name text placed in the networkNameDescriptor inside the Network Information Table (NIT). The maximum length is 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbnitsettings.html#cfn-medialive-channel-dvbnitsettings-networkname
         */
        readonly networkName?: string;
        /**
         * The number of milliseconds between instances of this table in the output transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbnitsettings.html#cfn-medialive-channel-dvbnitsettings-repinterval
         */
        readonly repInterval?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DvbNitSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DvbNitSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_DvbNitSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('networkId', cdk.validateNumber)(properties.networkId));
    errors.collect(cdk.propertyValidator('networkName', cdk.validateString)(properties.networkName));
    errors.collect(cdk.propertyValidator('repInterval', cdk.validateNumber)(properties.repInterval));
    return errors.wrap('supplied properties not correct for "DvbNitSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbNitSettings` resource
 *
 * @param properties - the TypeScript properties of a `DvbNitSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbNitSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelDvbNitSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_DvbNitSettingsPropertyValidator(properties).assertSuccess();
    return {
        NetworkId: cdk.numberToCloudFormation(properties.networkId),
        NetworkName: cdk.stringToCloudFormation(properties.networkName),
        RepInterval: cdk.numberToCloudFormation(properties.repInterval),
    };
}

// @ts-ignore TS6133
function CfnChannelDvbNitSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DvbNitSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DvbNitSettingsProperty>();
    ret.addPropertyResult('networkId', 'NetworkId', properties.NetworkId != null ? cfn_parse.FromCloudFormation.getNumber(properties.NetworkId) : undefined);
    ret.addPropertyResult('networkName', 'NetworkName', properties.NetworkName != null ? cfn_parse.FromCloudFormation.getString(properties.NetworkName) : undefined);
    ret.addPropertyResult('repInterval', 'RepInterval', properties.RepInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RepInterval) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * A DVB Service Description Table (SDT).
     *
     * The parent of this entity is M2tsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsdtsettings.html
     */
    export interface DvbSdtSettingsProperty {
        /**
         * Selects a method of inserting SDT information into an output stream. The sdtFollow setting copies SDT information from input stream to output stream. The sdtFollowIfPresent setting copies SDT information from input stream to output stream if SDT information is present in the input. Otherwise, it falls back on the user-defined values. The sdtManual setting means that the user will enter the SDT information. The sdtNone setting means that the output stream will not contain SDT information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsdtsettings.html#cfn-medialive-channel-dvbsdtsettings-outputsdt
         */
        readonly outputSdt?: string;
        /**
         * The number of milliseconds between instances of this table in the output transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsdtsettings.html#cfn-medialive-channel-dvbsdtsettings-repinterval
         */
        readonly repInterval?: number;
        /**
         * The service name placed in the serviceDescriptor in the Service Description Table (SDT). The maximum length is 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsdtsettings.html#cfn-medialive-channel-dvbsdtsettings-servicename
         */
        readonly serviceName?: string;
        /**
         * The service provider name placed in the serviceDescriptor in the Service Description Table (SDT). The maximum length is 256 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsdtsettings.html#cfn-medialive-channel-dvbsdtsettings-serviceprovidername
         */
        readonly serviceProviderName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `DvbSdtSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DvbSdtSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_DvbSdtSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('outputSdt', cdk.validateString)(properties.outputSdt));
    errors.collect(cdk.propertyValidator('repInterval', cdk.validateNumber)(properties.repInterval));
    errors.collect(cdk.propertyValidator('serviceName', cdk.validateString)(properties.serviceName));
    errors.collect(cdk.propertyValidator('serviceProviderName', cdk.validateString)(properties.serviceProviderName));
    return errors.wrap('supplied properties not correct for "DvbSdtSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSdtSettings` resource
 *
 * @param properties - the TypeScript properties of a `DvbSdtSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSdtSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelDvbSdtSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_DvbSdtSettingsPropertyValidator(properties).assertSuccess();
    return {
        OutputSdt: cdk.stringToCloudFormation(properties.outputSdt),
        RepInterval: cdk.numberToCloudFormation(properties.repInterval),
        ServiceName: cdk.stringToCloudFormation(properties.serviceName),
        ServiceProviderName: cdk.stringToCloudFormation(properties.serviceProviderName),
    };
}

// @ts-ignore TS6133
function CfnChannelDvbSdtSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DvbSdtSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DvbSdtSettingsProperty>();
    ret.addPropertyResult('outputSdt', 'OutputSdt', properties.OutputSdt != null ? cfn_parse.FromCloudFormation.getString(properties.OutputSdt) : undefined);
    ret.addPropertyResult('repInterval', 'RepInterval', properties.RepInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RepInterval) : undefined);
    ret.addPropertyResult('serviceName', 'ServiceName', properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined);
    ret.addPropertyResult('serviceProviderName', 'ServiceProviderName', properties.ServiceProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceProviderName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for DVB Sub captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html
     */
    export interface DvbSubDestinationSettingsProperty {
        /**
         * If no explicit xPosition or yPosition is provided, setting the alignment to centered places the captions at the bottom center of the output. Similarly, setting a left alignment aligns captions to the bottom left of the output. If x and y positions are specified in conjunction with the alignment parameter, the font is justified (either left or centered) relative to those coordinates. Selecting "smart" justification left-justifies live subtitles and center-justifies pre-recorded subtitles. This option is not valid for source captions that are STL or 608/embedded. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-alignment
         */
        readonly alignment?: string;
        /**
         * Specifies the color of the rectangle behind the captions. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-backgroundcolor
         */
        readonly backgroundColor?: string;
        /**
         * Specifies the opacity of the background rectangle. 255 is opaque; 0 is transparent. Keeping this parameter blank is equivalent to setting it to 0 (transparent). All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-backgroundopacity
         */
        readonly backgroundOpacity?: number;
        /**
         * The external font file that is used for captions burn-in. The file extension must be .ttf or .tte. Although you can select output fonts for many different types of input captions, embedded, STL, and Teletext sources use a strict grid system. Using external fonts with these captions sources could cause an unexpected display of proportional fonts. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-font
         */
        readonly font?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Specifies the color of the burned-in captions. This option is not valid for source captions that are STL, 608/embedded, or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-fontcolor
         */
        readonly fontColor?: string;
        /**
         * Specifies the opacity of the burned-in captions. 255 is opaque; 0 is transparent. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-fontopacity
         */
        readonly fontOpacity?: number;
        /**
         * The font resolution in DPI (dots per inch). The default is 96 dpi. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-fontresolution
         */
        readonly fontResolution?: number;
        /**
         * When set to auto, fontSize scales depending on the size of the output. Providing a positive integer specifies the exact font size in points. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-fontsize
         */
        readonly fontSize?: string;
        /**
         * Specifies the font outline color. This option is not valid for source captions that are either 608/embedded or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-outlinecolor
         */
        readonly outlineColor?: string;
        /**
         * Specifies the font outline size in pixels. This option is not valid for source captions that are either 608/embedded or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-outlinesize
         */
        readonly outlineSize?: number;
        /**
         * Specifies the color of the shadow that is cast by the captions. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-shadowcolor
         */
        readonly shadowColor?: string;
        /**
         * Specifies the opacity of the shadow. 255 is opaque; 0 is transparent. Keeping this parameter blank is equivalent to setting it to 0 (transparent). All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-shadowopacity
         */
        readonly shadowOpacity?: number;
        /**
         * Specifies the horizontal offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels to the left. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-shadowxoffset
         */
        readonly shadowXOffset?: number;
        /**
         * Specifies the vertical offset of the shadow relative to the captions in pixels. A value of -2 would result in a shadow offset 2 pixels above the text. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-shadowyoffset
         */
        readonly shadowYOffset?: number;
        /**
         * Controls whether a fixed grid size is used to generate the output subtitles bitmap. This applies to only Teletext inputs and DVB-Sub/Burn-in outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-teletextgridcontrol
         */
        readonly teletextGridControl?: string;
        /**
         * Specifies the horizontal position of the captions relative to the left side of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the left of the output. If no explicit xPosition is provided, the horizontal captions position is determined by the alignment parameter. This option is not valid for source captions that are STL, 608/embedded, or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-xposition
         */
        readonly xPosition?: number;
        /**
         * Specifies the vertical position of the captions relative to the top of the output in pixels. A value of 10 would result in the captions starting 10 pixels from the top of the output. If no explicit yPosition is provided, the captions are positioned towards the bottom of the output. This option is not valid for source captions that are STL, 608/embedded, or Teletext. These source settings are already pre-defined by the captions stream. All burn-in and DVB-Sub font settings must match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubdestinationsettings.html#cfn-medialive-channel-dvbsubdestinationsettings-yposition
         */
        readonly yPosition?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DvbSubDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DvbSubDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_DvbSubDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alignment', cdk.validateString)(properties.alignment));
    errors.collect(cdk.propertyValidator('backgroundColor', cdk.validateString)(properties.backgroundColor));
    errors.collect(cdk.propertyValidator('backgroundOpacity', cdk.validateNumber)(properties.backgroundOpacity));
    errors.collect(cdk.propertyValidator('font', CfnChannel_InputLocationPropertyValidator)(properties.font));
    errors.collect(cdk.propertyValidator('fontColor', cdk.validateString)(properties.fontColor));
    errors.collect(cdk.propertyValidator('fontOpacity', cdk.validateNumber)(properties.fontOpacity));
    errors.collect(cdk.propertyValidator('fontResolution', cdk.validateNumber)(properties.fontResolution));
    errors.collect(cdk.propertyValidator('fontSize', cdk.validateString)(properties.fontSize));
    errors.collect(cdk.propertyValidator('outlineColor', cdk.validateString)(properties.outlineColor));
    errors.collect(cdk.propertyValidator('outlineSize', cdk.validateNumber)(properties.outlineSize));
    errors.collect(cdk.propertyValidator('shadowColor', cdk.validateString)(properties.shadowColor));
    errors.collect(cdk.propertyValidator('shadowOpacity', cdk.validateNumber)(properties.shadowOpacity));
    errors.collect(cdk.propertyValidator('shadowXOffset', cdk.validateNumber)(properties.shadowXOffset));
    errors.collect(cdk.propertyValidator('shadowYOffset', cdk.validateNumber)(properties.shadowYOffset));
    errors.collect(cdk.propertyValidator('teletextGridControl', cdk.validateString)(properties.teletextGridControl));
    errors.collect(cdk.propertyValidator('xPosition', cdk.validateNumber)(properties.xPosition));
    errors.collect(cdk.propertyValidator('yPosition', cdk.validateNumber)(properties.yPosition));
    return errors.wrap('supplied properties not correct for "DvbSubDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSubDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `DvbSubDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSubDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelDvbSubDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_DvbSubDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        Alignment: cdk.stringToCloudFormation(properties.alignment),
        BackgroundColor: cdk.stringToCloudFormation(properties.backgroundColor),
        BackgroundOpacity: cdk.numberToCloudFormation(properties.backgroundOpacity),
        Font: cfnChannelInputLocationPropertyToCloudFormation(properties.font),
        FontColor: cdk.stringToCloudFormation(properties.fontColor),
        FontOpacity: cdk.numberToCloudFormation(properties.fontOpacity),
        FontResolution: cdk.numberToCloudFormation(properties.fontResolution),
        FontSize: cdk.stringToCloudFormation(properties.fontSize),
        OutlineColor: cdk.stringToCloudFormation(properties.outlineColor),
        OutlineSize: cdk.numberToCloudFormation(properties.outlineSize),
        ShadowColor: cdk.stringToCloudFormation(properties.shadowColor),
        ShadowOpacity: cdk.numberToCloudFormation(properties.shadowOpacity),
        ShadowXOffset: cdk.numberToCloudFormation(properties.shadowXOffset),
        ShadowYOffset: cdk.numberToCloudFormation(properties.shadowYOffset),
        TeletextGridControl: cdk.stringToCloudFormation(properties.teletextGridControl),
        XPosition: cdk.numberToCloudFormation(properties.xPosition),
        YPosition: cdk.numberToCloudFormation(properties.yPosition),
    };
}

// @ts-ignore TS6133
function CfnChannelDvbSubDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DvbSubDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DvbSubDestinationSettingsProperty>();
    ret.addPropertyResult('alignment', 'Alignment', properties.Alignment != null ? cfn_parse.FromCloudFormation.getString(properties.Alignment) : undefined);
    ret.addPropertyResult('backgroundColor', 'BackgroundColor', properties.BackgroundColor != null ? cfn_parse.FromCloudFormation.getString(properties.BackgroundColor) : undefined);
    ret.addPropertyResult('backgroundOpacity', 'BackgroundOpacity', properties.BackgroundOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.BackgroundOpacity) : undefined);
    ret.addPropertyResult('font', 'Font', properties.Font != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.Font) : undefined);
    ret.addPropertyResult('fontColor', 'FontColor', properties.FontColor != null ? cfn_parse.FromCloudFormation.getString(properties.FontColor) : undefined);
    ret.addPropertyResult('fontOpacity', 'FontOpacity', properties.FontOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.FontOpacity) : undefined);
    ret.addPropertyResult('fontResolution', 'FontResolution', properties.FontResolution != null ? cfn_parse.FromCloudFormation.getNumber(properties.FontResolution) : undefined);
    ret.addPropertyResult('fontSize', 'FontSize', properties.FontSize != null ? cfn_parse.FromCloudFormation.getString(properties.FontSize) : undefined);
    ret.addPropertyResult('outlineColor', 'OutlineColor', properties.OutlineColor != null ? cfn_parse.FromCloudFormation.getString(properties.OutlineColor) : undefined);
    ret.addPropertyResult('outlineSize', 'OutlineSize', properties.OutlineSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.OutlineSize) : undefined);
    ret.addPropertyResult('shadowColor', 'ShadowColor', properties.ShadowColor != null ? cfn_parse.FromCloudFormation.getString(properties.ShadowColor) : undefined);
    ret.addPropertyResult('shadowOpacity', 'ShadowOpacity', properties.ShadowOpacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowOpacity) : undefined);
    ret.addPropertyResult('shadowXOffset', 'ShadowXOffset', properties.ShadowXOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowXOffset) : undefined);
    ret.addPropertyResult('shadowYOffset', 'ShadowYOffset', properties.ShadowYOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShadowYOffset) : undefined);
    ret.addPropertyResult('teletextGridControl', 'TeletextGridControl', properties.TeletextGridControl != null ? cfn_parse.FromCloudFormation.getString(properties.TeletextGridControl) : undefined);
    ret.addPropertyResult('xPosition', 'XPosition', properties.XPosition != null ? cfn_parse.FromCloudFormation.getNumber(properties.XPosition) : undefined);
    ret.addPropertyResult('yPosition', 'YPosition', properties.YPosition != null ? cfn_parse.FromCloudFormation.getNumber(properties.YPosition) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the DVB Sub captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubsourcesettings.html
     */
    export interface DvbSubSourceSettingsProperty {
        /**
         * If you will configure a WebVTT caption description that references this caption selector, use this field to
         * provide the language to consider when translating the image-based source to text.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubsourcesettings.html#cfn-medialive-channel-dvbsubsourcesettings-ocrlanguage
         */
        readonly ocrLanguage?: string;
        /**
         * When using DVB-Sub with burn-in or SMPTE-TT, use this PID for the source content. It is unused for DVB-Sub passthrough. All DVB-Sub content is passed through, regardless of selectors.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbsubsourcesettings.html#cfn-medialive-channel-dvbsubsourcesettings-pid
         */
        readonly pid?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DvbSubSourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DvbSubSourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_DvbSubSourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ocrLanguage', cdk.validateString)(properties.ocrLanguage));
    errors.collect(cdk.propertyValidator('pid', cdk.validateNumber)(properties.pid));
    return errors.wrap('supplied properties not correct for "DvbSubSourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSubSourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `DvbSubSourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbSubSourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelDvbSubSourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_DvbSubSourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        OcrLanguage: cdk.stringToCloudFormation(properties.ocrLanguage),
        Pid: cdk.numberToCloudFormation(properties.pid),
    };
}

// @ts-ignore TS6133
function CfnChannelDvbSubSourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DvbSubSourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DvbSubSourceSettingsProperty>();
    ret.addPropertyResult('ocrLanguage', 'OcrLanguage', properties.OcrLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.OcrLanguage) : undefined);
    ret.addPropertyResult('pid', 'Pid', properties.Pid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Pid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The DVB Time and Date Table (TDT).
     *
     * The parent of this entity is M2tsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbtdtsettings.html
     */
    export interface DvbTdtSettingsProperty {
        /**
         * The number of milliseconds between instances of this table in the output transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbtdtsettings.html#cfn-medialive-channel-dvbtdtsettings-repinterval
         */
        readonly repInterval?: number;
    }
}

/**
 * Determine whether the given properties match those of a `DvbTdtSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DvbTdtSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_DvbTdtSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('repInterval', cdk.validateNumber)(properties.repInterval));
    return errors.wrap('supplied properties not correct for "DvbTdtSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbTdtSettings` resource
 *
 * @param properties - the TypeScript properties of a `DvbTdtSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.DvbTdtSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelDvbTdtSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_DvbTdtSettingsPropertyValidator(properties).assertSuccess();
    return {
        RepInterval: cdk.numberToCloudFormation(properties.repInterval),
    };
}

// @ts-ignore TS6133
function CfnChannelDvbTdtSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DvbTdtSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DvbTdtSettingsProperty>();
    ret.addPropertyResult('repInterval', 'RepInterval', properties.RepInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RepInterval) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an EAC3 audio encode in the output.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html
     */
    export interface Eac3SettingsProperty {
        /**
         * When set to attenuate3Db, applies a 3 dB attenuation to the surround channels. Used only for the 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-attenuationcontrol
         */
        readonly attenuationControl?: string;
        /**
         * The average bitrate in bits/second. Valid bitrates depend on the coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-bitrate
         */
        readonly bitrate?: number;
        /**
         * Specifies the bitstream mode (bsmod) for the emitted E-AC-3 stream. For more information, see ATSC A/52-2012 (Annex E).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-bitstreammode
         */
        readonly bitstreamMode?: string;
        /**
         * The Dolby Digital Plus coding mode. This mode determines the number of channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-codingmode
         */
        readonly codingMode?: string;
        /**
         * When set to enabled, activates a DC highpass filter for all input channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-dcfilter
         */
        readonly dcFilter?: string;
        /**
         * Sets the dialnorm for the output. If blank and the input audio is Dolby Digital Plus, dialnorm will be passed through.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-dialnorm
         */
        readonly dialnorm?: number;
        /**
         * Sets the Dolby dynamic range compression profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-drcline
         */
        readonly drcLine?: string;
        /**
         * Sets the profile for heavy Dolby dynamic range compression, ensuring that the instantaneous signal peaks do not exceed specified levels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-drcrf
         */
        readonly drcRf?: string;
        /**
         * When encoding 3/2 audio, setting to lfe enables the LFE channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-lfecontrol
         */
        readonly lfeControl?: string;
        /**
         * When set to enabled, applies a 120Hz lowpass filter to the LFE channel prior to encoding. Valid only with a codingMode32 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-lfefilter
         */
        readonly lfeFilter?: string;
        /**
         * The Left only/Right only center mix level. Used only for the 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-lorocentermixlevel
         */
        readonly loRoCenterMixLevel?: number;
        /**
         * The Left only/Right only surround mix level. Used only for a 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-lorosurroundmixlevel
         */
        readonly loRoSurroundMixLevel?: number;
        /**
         * The Left total/Right total center mix level. Used only for a 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-ltrtcentermixlevel
         */
        readonly ltRtCenterMixLevel?: number;
        /**
         * The Left total/Right total surround mix level. Used only for the 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-ltrtsurroundmixlevel
         */
        readonly ltRtSurroundMixLevel?: number;
        /**
         * When set to followInput, encoder metadata is sourced from the DD, DD+, or DolbyE decoder that supplies this audio data. If the audio is not supplied from one of these streams, then the static metadata settings are used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-metadatacontrol
         */
        readonly metadataControl?: string;
        /**
         * When set to whenPossible, input DD+ audio will be passed through if it is present on the input. This detection is dynamic over the life of the transcode. Inputs that alternate between DD+ and non-DD+ content will have a consistent DD+ output as the system alternates between passthrough and encoding.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-passthroughcontrol
         */
        readonly passthroughControl?: string;
        /**
         * When set to shift90Degrees, applies a 90-degree phase shift to the surround channels. Used only for a 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-phasecontrol
         */
        readonly phaseControl?: string;
        /**
         * A stereo downmix preference. Used only for the 3/2 coding mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-stereodownmix
         */
        readonly stereoDownmix?: string;
        /**
         * When encoding 3/2 audio, sets whether an extra center back surround channel is matrix encoded into the left and right surround channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-surroundexmode
         */
        readonly surroundExMode?: string;
        /**
         * When encoding 2/0 audio, sets whether Dolby Surround is matrix-encoded into the two channels.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-eac3settings.html#cfn-medialive-channel-eac3settings-surroundmode
         */
        readonly surroundMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Eac3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Eac3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Eac3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('attenuationControl', cdk.validateString)(properties.attenuationControl));
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('bitstreamMode', cdk.validateString)(properties.bitstreamMode));
    errors.collect(cdk.propertyValidator('codingMode', cdk.validateString)(properties.codingMode));
    errors.collect(cdk.propertyValidator('dcFilter', cdk.validateString)(properties.dcFilter));
    errors.collect(cdk.propertyValidator('dialnorm', cdk.validateNumber)(properties.dialnorm));
    errors.collect(cdk.propertyValidator('drcLine', cdk.validateString)(properties.drcLine));
    errors.collect(cdk.propertyValidator('drcRf', cdk.validateString)(properties.drcRf));
    errors.collect(cdk.propertyValidator('lfeControl', cdk.validateString)(properties.lfeControl));
    errors.collect(cdk.propertyValidator('lfeFilter', cdk.validateString)(properties.lfeFilter));
    errors.collect(cdk.propertyValidator('loRoCenterMixLevel', cdk.validateNumber)(properties.loRoCenterMixLevel));
    errors.collect(cdk.propertyValidator('loRoSurroundMixLevel', cdk.validateNumber)(properties.loRoSurroundMixLevel));
    errors.collect(cdk.propertyValidator('ltRtCenterMixLevel', cdk.validateNumber)(properties.ltRtCenterMixLevel));
    errors.collect(cdk.propertyValidator('ltRtSurroundMixLevel', cdk.validateNumber)(properties.ltRtSurroundMixLevel));
    errors.collect(cdk.propertyValidator('metadataControl', cdk.validateString)(properties.metadataControl));
    errors.collect(cdk.propertyValidator('passthroughControl', cdk.validateString)(properties.passthroughControl));
    errors.collect(cdk.propertyValidator('phaseControl', cdk.validateString)(properties.phaseControl));
    errors.collect(cdk.propertyValidator('stereoDownmix', cdk.validateString)(properties.stereoDownmix));
    errors.collect(cdk.propertyValidator('surroundExMode', cdk.validateString)(properties.surroundExMode));
    errors.collect(cdk.propertyValidator('surroundMode', cdk.validateString)(properties.surroundMode));
    return errors.wrap('supplied properties not correct for "Eac3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Eac3Settings` resource
 *
 * @param properties - the TypeScript properties of a `Eac3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Eac3Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEac3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Eac3SettingsPropertyValidator(properties).assertSuccess();
    return {
        AttenuationControl: cdk.stringToCloudFormation(properties.attenuationControl),
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        BitstreamMode: cdk.stringToCloudFormation(properties.bitstreamMode),
        CodingMode: cdk.stringToCloudFormation(properties.codingMode),
        DcFilter: cdk.stringToCloudFormation(properties.dcFilter),
        Dialnorm: cdk.numberToCloudFormation(properties.dialnorm),
        DrcLine: cdk.stringToCloudFormation(properties.drcLine),
        DrcRf: cdk.stringToCloudFormation(properties.drcRf),
        LfeControl: cdk.stringToCloudFormation(properties.lfeControl),
        LfeFilter: cdk.stringToCloudFormation(properties.lfeFilter),
        LoRoCenterMixLevel: cdk.numberToCloudFormation(properties.loRoCenterMixLevel),
        LoRoSurroundMixLevel: cdk.numberToCloudFormation(properties.loRoSurroundMixLevel),
        LtRtCenterMixLevel: cdk.numberToCloudFormation(properties.ltRtCenterMixLevel),
        LtRtSurroundMixLevel: cdk.numberToCloudFormation(properties.ltRtSurroundMixLevel),
        MetadataControl: cdk.stringToCloudFormation(properties.metadataControl),
        PassthroughControl: cdk.stringToCloudFormation(properties.passthroughControl),
        PhaseControl: cdk.stringToCloudFormation(properties.phaseControl),
        StereoDownmix: cdk.stringToCloudFormation(properties.stereoDownmix),
        SurroundExMode: cdk.stringToCloudFormation(properties.surroundExMode),
        SurroundMode: cdk.stringToCloudFormation(properties.surroundMode),
    };
}

// @ts-ignore TS6133
function CfnChannelEac3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Eac3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Eac3SettingsProperty>();
    ret.addPropertyResult('attenuationControl', 'AttenuationControl', properties.AttenuationControl != null ? cfn_parse.FromCloudFormation.getString(properties.AttenuationControl) : undefined);
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('bitstreamMode', 'BitstreamMode', properties.BitstreamMode != null ? cfn_parse.FromCloudFormation.getString(properties.BitstreamMode) : undefined);
    ret.addPropertyResult('codingMode', 'CodingMode', properties.CodingMode != null ? cfn_parse.FromCloudFormation.getString(properties.CodingMode) : undefined);
    ret.addPropertyResult('dcFilter', 'DcFilter', properties.DcFilter != null ? cfn_parse.FromCloudFormation.getString(properties.DcFilter) : undefined);
    ret.addPropertyResult('dialnorm', 'Dialnorm', properties.Dialnorm != null ? cfn_parse.FromCloudFormation.getNumber(properties.Dialnorm) : undefined);
    ret.addPropertyResult('drcLine', 'DrcLine', properties.DrcLine != null ? cfn_parse.FromCloudFormation.getString(properties.DrcLine) : undefined);
    ret.addPropertyResult('drcRf', 'DrcRf', properties.DrcRf != null ? cfn_parse.FromCloudFormation.getString(properties.DrcRf) : undefined);
    ret.addPropertyResult('lfeControl', 'LfeControl', properties.LfeControl != null ? cfn_parse.FromCloudFormation.getString(properties.LfeControl) : undefined);
    ret.addPropertyResult('lfeFilter', 'LfeFilter', properties.LfeFilter != null ? cfn_parse.FromCloudFormation.getString(properties.LfeFilter) : undefined);
    ret.addPropertyResult('loRoCenterMixLevel', 'LoRoCenterMixLevel', properties.LoRoCenterMixLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoRoCenterMixLevel) : undefined);
    ret.addPropertyResult('loRoSurroundMixLevel', 'LoRoSurroundMixLevel', properties.LoRoSurroundMixLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.LoRoSurroundMixLevel) : undefined);
    ret.addPropertyResult('ltRtCenterMixLevel', 'LtRtCenterMixLevel', properties.LtRtCenterMixLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.LtRtCenterMixLevel) : undefined);
    ret.addPropertyResult('ltRtSurroundMixLevel', 'LtRtSurroundMixLevel', properties.LtRtSurroundMixLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.LtRtSurroundMixLevel) : undefined);
    ret.addPropertyResult('metadataControl', 'MetadataControl', properties.MetadataControl != null ? cfn_parse.FromCloudFormation.getString(properties.MetadataControl) : undefined);
    ret.addPropertyResult('passthroughControl', 'PassthroughControl', properties.PassthroughControl != null ? cfn_parse.FromCloudFormation.getString(properties.PassthroughControl) : undefined);
    ret.addPropertyResult('phaseControl', 'PhaseControl', properties.PhaseControl != null ? cfn_parse.FromCloudFormation.getString(properties.PhaseControl) : undefined);
    ret.addPropertyResult('stereoDownmix', 'StereoDownmix', properties.StereoDownmix != null ? cfn_parse.FromCloudFormation.getString(properties.StereoDownmix) : undefined);
    ret.addPropertyResult('surroundExMode', 'SurroundExMode', properties.SurroundExMode != null ? cfn_parse.FromCloudFormation.getString(properties.SurroundExMode) : undefined);
    ret.addPropertyResult('surroundMode', 'SurroundMode', properties.SurroundMode != null ? cfn_parse.FromCloudFormation.getString(properties.SurroundMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for EBU-TT captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ebuttddestinationsettings.html
     */
    export interface EbuTtDDestinationSettingsProperty {
        /**
         * Applies only if you plan to convert these source captions to EBU-TT-D or TTML in an output. Complete this field if you want to include the name of the copyright holder in the copyright metadata tag in the TTML
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ebuttddestinationsettings.html#cfn-medialive-channel-ebuttddestinationsettings-copyrightholder
         */
        readonly copyrightHolder?: string;
        /**
         * Specifies how to handle the gap between the lines (in multi-line captions). - enabled: Fill with the captions background color (as specified in the input captions).
         * - disabled: Leave the gap unfilled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ebuttddestinationsettings.html#cfn-medialive-channel-ebuttddestinationsettings-filllinegap
         */
        readonly fillLineGap?: string;
        /**
         * Specifies the font family to include in the font data attached to the EBU-TT captions. Valid only if styleControl is set to include. If you leave this field empty, the font family is set to "monospaced". (If styleControl is set to exclude, the font family is always set to "monospaced".) You specify only the font family. All other style information (color, bold, position and so on) is copied from the input captions. The size is always set to 100% to allow the downstream player to choose the size. - Enter a list of font families, as a comma-separated list of font names, in order of preference. The name can be a font family (such as “Arial”), or a generic font family (such as “serif”), or “default” (to let the downstream player choose the font).
         * - Leave blank to set the family to “monospace”.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ebuttddestinationsettings.html#cfn-medialive-channel-ebuttddestinationsettings-fontfamily
         */
        readonly fontFamily?: string;
        /**
         * Specifies the style information (font color, font position, and so on) to include in the font data that is attached to the EBU-TT captions. - include: Take the style information (font color, font position, and so on) from the source captions and include that information in the font data attached to the EBU-TT captions. This option is valid only if the source captions are Embedded or Teletext.
         * - exclude: In the font data attached to the EBU-TT captions, set the font family to "monospaced". Do not include any other style information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ebuttddestinationsettings.html#cfn-medialive-channel-ebuttddestinationsettings-stylecontrol
         */
        readonly styleControl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `EbuTtDDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `EbuTtDDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_EbuTtDDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('copyrightHolder', cdk.validateString)(properties.copyrightHolder));
    errors.collect(cdk.propertyValidator('fillLineGap', cdk.validateString)(properties.fillLineGap));
    errors.collect(cdk.propertyValidator('fontFamily', cdk.validateString)(properties.fontFamily));
    errors.collect(cdk.propertyValidator('styleControl', cdk.validateString)(properties.styleControl));
    return errors.wrap('supplied properties not correct for "EbuTtDDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EbuTtDDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `EbuTtDDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EbuTtDDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEbuTtDDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_EbuTtDDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        CopyrightHolder: cdk.stringToCloudFormation(properties.copyrightHolder),
        FillLineGap: cdk.stringToCloudFormation(properties.fillLineGap),
        FontFamily: cdk.stringToCloudFormation(properties.fontFamily),
        StyleControl: cdk.stringToCloudFormation(properties.styleControl),
    };
}

// @ts-ignore TS6133
function CfnChannelEbuTtDDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.EbuTtDDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.EbuTtDDestinationSettingsProperty>();
    ret.addPropertyResult('copyrightHolder', 'CopyrightHolder', properties.CopyrightHolder != null ? cfn_parse.FromCloudFormation.getString(properties.CopyrightHolder) : undefined);
    ret.addPropertyResult('fillLineGap', 'FillLineGap', properties.FillLineGap != null ? cfn_parse.FromCloudFormation.getString(properties.FillLineGap) : undefined);
    ret.addPropertyResult('fontFamily', 'FontFamily', properties.FontFamily != null ? cfn_parse.FromCloudFormation.getString(properties.FontFamily) : undefined);
    ret.addPropertyResult('styleControl', 'StyleControl', properties.StyleControl != null ? cfn_parse.FromCloudFormation.getString(properties.StyleControl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of embedded captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddeddestinationsettings.html
     */
    export interface EmbeddedDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `EmbeddedDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `EmbeddedDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_EmbeddedDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "EmbeddedDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `EmbeddedDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEmbeddedDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_EmbeddedDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelEmbeddedDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.EmbeddedDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.EmbeddedDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for embedded plus SCTE-20 captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedplusscte20destinationsettings.html
     */
    export interface EmbeddedPlusScte20DestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `EmbeddedPlusScte20DestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `EmbeddedPlusScte20DestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_EmbeddedPlusScte20DestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "EmbeddedPlusScte20DestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedPlusScte20DestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `EmbeddedPlusScte20DestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedPlusScte20DestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEmbeddedPlusScte20DestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_EmbeddedPlusScte20DestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelEmbeddedPlusScte20DestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.EmbeddedPlusScte20DestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.EmbeddedPlusScte20DestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the embedded captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedsourcesettings.html
     */
    export interface EmbeddedSourceSettingsProperty {
        /**
         * If this is upconvert, 608 data is both passed through the "608 compatibility bytes" fields of the 708 wrapper as well as translated into 708. If 708 data is present in the source content, it is discarded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedsourcesettings.html#cfn-medialive-channel-embeddedsourcesettings-convert608to708
         */
        readonly convert608To708?: string;
        /**
         * Set to "auto" to handle streams with intermittent or non-aligned SCTE-20 and embedded captions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedsourcesettings.html#cfn-medialive-channel-embeddedsourcesettings-scte20detection
         */
        readonly scte20Detection?: string;
        /**
         * Specifies the 608/708 channel number within the video track from which to extract captions. This is unused for passthrough.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedsourcesettings.html#cfn-medialive-channel-embeddedsourcesettings-source608channelnumber
         */
        readonly source608ChannelNumber?: number;
        /**
         * This field is unused and deprecated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-embeddedsourcesettings.html#cfn-medialive-channel-embeddedsourcesettings-source608tracknumber
         */
        readonly source608TrackNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `EmbeddedSourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `EmbeddedSourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_EmbeddedSourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('convert608To708', cdk.validateString)(properties.convert608To708));
    errors.collect(cdk.propertyValidator('scte20Detection', cdk.validateString)(properties.scte20Detection));
    errors.collect(cdk.propertyValidator('source608ChannelNumber', cdk.validateNumber)(properties.source608ChannelNumber));
    errors.collect(cdk.propertyValidator('source608TrackNumber', cdk.validateNumber)(properties.source608TrackNumber));
    return errors.wrap('supplied properties not correct for "EmbeddedSourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedSourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `EmbeddedSourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EmbeddedSourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEmbeddedSourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_EmbeddedSourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        Convert608To708: cdk.stringToCloudFormation(properties.convert608To708),
        Scte20Detection: cdk.stringToCloudFormation(properties.scte20Detection),
        Source608ChannelNumber: cdk.numberToCloudFormation(properties.source608ChannelNumber),
        Source608TrackNumber: cdk.numberToCloudFormation(properties.source608TrackNumber),
    };
}

// @ts-ignore TS6133
function CfnChannelEmbeddedSourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.EmbeddedSourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.EmbeddedSourceSettingsProperty>();
    ret.addPropertyResult('convert608To708', 'Convert608To708', properties.Convert608To708 != null ? cfn_parse.FromCloudFormation.getString(properties.Convert608To708) : undefined);
    ret.addPropertyResult('scte20Detection', 'Scte20Detection', properties.Scte20Detection != null ? cfn_parse.FromCloudFormation.getString(properties.Scte20Detection) : undefined);
    ret.addPropertyResult('source608ChannelNumber', 'Source608ChannelNumber', properties.Source608ChannelNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.Source608ChannelNumber) : undefined);
    ret.addPropertyResult('source608TrackNumber', 'Source608TrackNumber', properties.Source608TrackNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.Source608TrackNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the encoding of outputs.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html
     */
    export interface EncoderSettingsProperty {
        /**
         * The encoding information for output audio.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-audiodescriptions
         */
        readonly audioDescriptions?: Array<CfnChannel.AudioDescriptionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The settings for ad avail blanking.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-availblanking
         */
        readonly availBlanking?: CfnChannel.AvailBlankingProperty | cdk.IResolvable;
        /**
         * The configuration settings for the ad avail handling.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-availconfiguration
         */
        readonly availConfiguration?: CfnChannel.AvailConfigurationProperty | cdk.IResolvable;
        /**
         * The settings for the blackout slate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-blackoutslate
         */
        readonly blackoutSlate?: CfnChannel.BlackoutSlateProperty | cdk.IResolvable;
        /**
         * The encoding information for output captions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-captiondescriptions
         */
        readonly captionDescriptions?: Array<CfnChannel.CaptionDescriptionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Settings to enable specific features.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-featureactivations
         */
        readonly featureActivations?: CfnChannel.FeatureActivationsProperty | cdk.IResolvable;
        /**
         * The configuration settings that apply to the entire channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-globalconfiguration
         */
        readonly globalConfiguration?: CfnChannel.GlobalConfigurationProperty | cdk.IResolvable;
        /**
         * Settings to enable and configure the motion graphics overlay feature in the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-motiongraphicsconfiguration
         */
        readonly motionGraphicsConfiguration?: CfnChannel.MotionGraphicsConfigurationProperty | cdk.IResolvable;
        /**
         * The settings to configure Nielsen watermarks.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-nielsenconfiguration
         */
        readonly nielsenConfiguration?: CfnChannel.NielsenConfigurationProperty | cdk.IResolvable;
        /**
         * The settings for the output groups in the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-outputgroups
         */
        readonly outputGroups?: Array<CfnChannel.OutputGroupProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Contains settings used to acquire and adjust timecode information from the inputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-timecodeconfig
         */
        readonly timecodeConfig?: CfnChannel.TimecodeConfigProperty | cdk.IResolvable;
        /**
         * The encoding information for output videos.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-encodersettings.html#cfn-medialive-channel-encodersettings-videodescriptions
         */
        readonly videoDescriptions?: Array<CfnChannel.VideoDescriptionProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `EncoderSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `EncoderSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_EncoderSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioDescriptions', cdk.listValidator(CfnChannel_AudioDescriptionPropertyValidator))(properties.audioDescriptions));
    errors.collect(cdk.propertyValidator('availBlanking', CfnChannel_AvailBlankingPropertyValidator)(properties.availBlanking));
    errors.collect(cdk.propertyValidator('availConfiguration', CfnChannel_AvailConfigurationPropertyValidator)(properties.availConfiguration));
    errors.collect(cdk.propertyValidator('blackoutSlate', CfnChannel_BlackoutSlatePropertyValidator)(properties.blackoutSlate));
    errors.collect(cdk.propertyValidator('captionDescriptions', cdk.listValidator(CfnChannel_CaptionDescriptionPropertyValidator))(properties.captionDescriptions));
    errors.collect(cdk.propertyValidator('featureActivations', CfnChannel_FeatureActivationsPropertyValidator)(properties.featureActivations));
    errors.collect(cdk.propertyValidator('globalConfiguration', CfnChannel_GlobalConfigurationPropertyValidator)(properties.globalConfiguration));
    errors.collect(cdk.propertyValidator('motionGraphicsConfiguration', CfnChannel_MotionGraphicsConfigurationPropertyValidator)(properties.motionGraphicsConfiguration));
    errors.collect(cdk.propertyValidator('nielsenConfiguration', CfnChannel_NielsenConfigurationPropertyValidator)(properties.nielsenConfiguration));
    errors.collect(cdk.propertyValidator('outputGroups', cdk.listValidator(CfnChannel_OutputGroupPropertyValidator))(properties.outputGroups));
    errors.collect(cdk.propertyValidator('timecodeConfig', CfnChannel_TimecodeConfigPropertyValidator)(properties.timecodeConfig));
    errors.collect(cdk.propertyValidator('videoDescriptions', cdk.listValidator(CfnChannel_VideoDescriptionPropertyValidator))(properties.videoDescriptions));
    return errors.wrap('supplied properties not correct for "EncoderSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EncoderSettings` resource
 *
 * @param properties - the TypeScript properties of a `EncoderSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.EncoderSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelEncoderSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_EncoderSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioDescriptions: cdk.listMapper(cfnChannelAudioDescriptionPropertyToCloudFormation)(properties.audioDescriptions),
        AvailBlanking: cfnChannelAvailBlankingPropertyToCloudFormation(properties.availBlanking),
        AvailConfiguration: cfnChannelAvailConfigurationPropertyToCloudFormation(properties.availConfiguration),
        BlackoutSlate: cfnChannelBlackoutSlatePropertyToCloudFormation(properties.blackoutSlate),
        CaptionDescriptions: cdk.listMapper(cfnChannelCaptionDescriptionPropertyToCloudFormation)(properties.captionDescriptions),
        FeatureActivations: cfnChannelFeatureActivationsPropertyToCloudFormation(properties.featureActivations),
        GlobalConfiguration: cfnChannelGlobalConfigurationPropertyToCloudFormation(properties.globalConfiguration),
        MotionGraphicsConfiguration: cfnChannelMotionGraphicsConfigurationPropertyToCloudFormation(properties.motionGraphicsConfiguration),
        NielsenConfiguration: cfnChannelNielsenConfigurationPropertyToCloudFormation(properties.nielsenConfiguration),
        OutputGroups: cdk.listMapper(cfnChannelOutputGroupPropertyToCloudFormation)(properties.outputGroups),
        TimecodeConfig: cfnChannelTimecodeConfigPropertyToCloudFormation(properties.timecodeConfig),
        VideoDescriptions: cdk.listMapper(cfnChannelVideoDescriptionPropertyToCloudFormation)(properties.videoDescriptions),
    };
}

// @ts-ignore TS6133
function CfnChannelEncoderSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.EncoderSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.EncoderSettingsProperty>();
    ret.addPropertyResult('audioDescriptions', 'AudioDescriptions', properties.AudioDescriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelAudioDescriptionPropertyFromCloudFormation)(properties.AudioDescriptions) : undefined);
    ret.addPropertyResult('availBlanking', 'AvailBlanking', properties.AvailBlanking != null ? CfnChannelAvailBlankingPropertyFromCloudFormation(properties.AvailBlanking) : undefined);
    ret.addPropertyResult('availConfiguration', 'AvailConfiguration', properties.AvailConfiguration != null ? CfnChannelAvailConfigurationPropertyFromCloudFormation(properties.AvailConfiguration) : undefined);
    ret.addPropertyResult('blackoutSlate', 'BlackoutSlate', properties.BlackoutSlate != null ? CfnChannelBlackoutSlatePropertyFromCloudFormation(properties.BlackoutSlate) : undefined);
    ret.addPropertyResult('captionDescriptions', 'CaptionDescriptions', properties.CaptionDescriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelCaptionDescriptionPropertyFromCloudFormation)(properties.CaptionDescriptions) : undefined);
    ret.addPropertyResult('featureActivations', 'FeatureActivations', properties.FeatureActivations != null ? CfnChannelFeatureActivationsPropertyFromCloudFormation(properties.FeatureActivations) : undefined);
    ret.addPropertyResult('globalConfiguration', 'GlobalConfiguration', properties.GlobalConfiguration != null ? CfnChannelGlobalConfigurationPropertyFromCloudFormation(properties.GlobalConfiguration) : undefined);
    ret.addPropertyResult('motionGraphicsConfiguration', 'MotionGraphicsConfiguration', properties.MotionGraphicsConfiguration != null ? CfnChannelMotionGraphicsConfigurationPropertyFromCloudFormation(properties.MotionGraphicsConfiguration) : undefined);
    ret.addPropertyResult('nielsenConfiguration', 'NielsenConfiguration', properties.NielsenConfiguration != null ? CfnChannelNielsenConfigurationPropertyFromCloudFormation(properties.NielsenConfiguration) : undefined);
    ret.addPropertyResult('outputGroups', 'OutputGroups', properties.OutputGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelOutputGroupPropertyFromCloudFormation)(properties.OutputGroups) : undefined);
    ret.addPropertyResult('timecodeConfig', 'TimecodeConfig', properties.TimecodeConfig != null ? CfnChannelTimecodeConfigPropertyFromCloudFormation(properties.TimecodeConfig) : undefined);
    ret.addPropertyResult('videoDescriptions', 'VideoDescriptions', properties.VideoDescriptions != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelVideoDescriptionPropertyFromCloudFormation)(properties.VideoDescriptions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Failover Condition settings. There can be multiple failover conditions inside AutomaticInputFailoverSettings.
     *
     * The parent of this entity is AutomaticInputFailoverSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failovercondition.html
     */
    export interface FailoverConditionProperty {
        /**
         * Settings for a specific failover condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failovercondition.html#cfn-medialive-channel-failovercondition-failoverconditionsettings
         */
        readonly failoverConditionSettings?: CfnChannel.FailoverConditionSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FailoverConditionProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FailoverConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('failoverConditionSettings', CfnChannel_FailoverConditionSettingsPropertyValidator)(properties.failoverConditionSettings));
    return errors.wrap('supplied properties not correct for "FailoverConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FailoverCondition` resource
 *
 * @param properties - the TypeScript properties of a `FailoverConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FailoverCondition` resource.
 */
// @ts-ignore TS6133
function cfnChannelFailoverConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FailoverConditionPropertyValidator(properties).assertSuccess();
    return {
        FailoverConditionSettings: cfnChannelFailoverConditionSettingsPropertyToCloudFormation(properties.failoverConditionSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelFailoverConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FailoverConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FailoverConditionProperty>();
    ret.addPropertyResult('failoverConditionSettings', 'FailoverConditionSettings', properties.FailoverConditionSettings != null ? CfnChannelFailoverConditionSettingsPropertyFromCloudFormation(properties.FailoverConditionSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for one failover condition.
     *
     * The parent of this entity is FailoverCondition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failoverconditionsettings.html
     */
    export interface FailoverConditionSettingsProperty {
        /**
         * MediaLive will perform a failover if the specified audio selector is silent for the specified period.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failoverconditionsettings.html#cfn-medialive-channel-failoverconditionsettings-audiosilencesettings
         */
        readonly audioSilenceSettings?: CfnChannel.AudioSilenceFailoverSettingsProperty | cdk.IResolvable;
        /**
         * MediaLive will perform a failover if content is not detected in this input for the specified period.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failoverconditionsettings.html#cfn-medialive-channel-failoverconditionsettings-inputlosssettings
         */
        readonly inputLossSettings?: CfnChannel.InputLossFailoverSettingsProperty | cdk.IResolvable;
        /**
         * MediaLive will perform a failover if content is considered black for the specified period.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failoverconditionsettings.html#cfn-medialive-channel-failoverconditionsettings-videoblacksettings
         */
        readonly videoBlackSettings?: CfnChannel.VideoBlackFailoverSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FailoverConditionSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FailoverConditionSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FailoverConditionSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioSilenceSettings', CfnChannel_AudioSilenceFailoverSettingsPropertyValidator)(properties.audioSilenceSettings));
    errors.collect(cdk.propertyValidator('inputLossSettings', CfnChannel_InputLossFailoverSettingsPropertyValidator)(properties.inputLossSettings));
    errors.collect(cdk.propertyValidator('videoBlackSettings', CfnChannel_VideoBlackFailoverSettingsPropertyValidator)(properties.videoBlackSettings));
    return errors.wrap('supplied properties not correct for "FailoverConditionSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FailoverConditionSettings` resource
 *
 * @param properties - the TypeScript properties of a `FailoverConditionSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FailoverConditionSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFailoverConditionSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FailoverConditionSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioSilenceSettings: cfnChannelAudioSilenceFailoverSettingsPropertyToCloudFormation(properties.audioSilenceSettings),
        InputLossSettings: cfnChannelInputLossFailoverSettingsPropertyToCloudFormation(properties.inputLossSettings),
        VideoBlackSettings: cfnChannelVideoBlackFailoverSettingsPropertyToCloudFormation(properties.videoBlackSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelFailoverConditionSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FailoverConditionSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FailoverConditionSettingsProperty>();
    ret.addPropertyResult('audioSilenceSettings', 'AudioSilenceSettings', properties.AudioSilenceSettings != null ? CfnChannelAudioSilenceFailoverSettingsPropertyFromCloudFormation(properties.AudioSilenceSettings) : undefined);
    ret.addPropertyResult('inputLossSettings', 'InputLossSettings', properties.InputLossSettings != null ? CfnChannelInputLossFailoverSettingsPropertyFromCloudFormation(properties.InputLossSettings) : undefined);
    ret.addPropertyResult('videoBlackSettings', 'VideoBlackSettings', properties.VideoBlackSettings != null ? CfnChannelVideoBlackFailoverSettingsPropertyFromCloudFormation(properties.VideoBlackSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to enable specific features. You can't configure these features until you have enabled them in the channel.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-featureactivations.html
     */
    export interface FeatureActivationsProperty {
        /**
         * Enables the Input Prepare feature. You can create Input Prepare actions in the schedule only if this feature is enabled.
         * If you disable the feature on an existing schedule, make sure that you first delete all input prepare actions from the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-featureactivations.html#cfn-medialive-channel-featureactivations-inputpreparescheduleactions
         */
        readonly inputPrepareScheduleActions?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FeatureActivationsProperty`
 *
 * @param properties - the TypeScript properties of a `FeatureActivationsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FeatureActivationsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputPrepareScheduleActions', cdk.validateString)(properties.inputPrepareScheduleActions));
    return errors.wrap('supplied properties not correct for "FeatureActivationsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FeatureActivations` resource
 *
 * @param properties - the TypeScript properties of a `FeatureActivationsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FeatureActivations` resource.
 */
// @ts-ignore TS6133
function cfnChannelFeatureActivationsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FeatureActivationsPropertyValidator(properties).assertSuccess();
    return {
        InputPrepareScheduleActions: cdk.stringToCloudFormation(properties.inputPrepareScheduleActions),
    };
}

// @ts-ignore TS6133
function CfnChannelFeatureActivationsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FeatureActivationsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FeatureActivationsProperty>();
    ret.addPropertyResult('inputPrepareScheduleActions', 'InputPrepareScheduleActions', properties.InputPrepareScheduleActions != null ? cfn_parse.FromCloudFormation.getString(properties.InputPrepareScheduleActions) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for FEC.
     *
     * The parent of this entity is UdpOutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fecoutputsettings.html
     */
    export interface FecOutputSettingsProperty {
        /**
         * The parameter D from SMPTE 2022-1. The height of the FEC protection matrix. The number of transport stream packets per column error correction packet. The number must be between 4 and 20, inclusive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fecoutputsettings.html#cfn-medialive-channel-fecoutputsettings-columndepth
         */
        readonly columnDepth?: number;
        /**
         * Enables column only or column and row-based FEC.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fecoutputsettings.html#cfn-medialive-channel-fecoutputsettings-includefec
         */
        readonly includeFec?: string;
        /**
         * The parameter L from SMPTE 2022-1. The width of the FEC protection matrix. Must be between 1 and 20, inclusive. If only Column FEC is used, then larger values increase robustness. If Row FEC is used, then this is the number of transport stream packets per row error correction packet, and the value must be between 4 and 20, inclusive, if includeFec is columnAndRow. If includeFec is column, this value must be 1 to 20, inclusive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fecoutputsettings.html#cfn-medialive-channel-fecoutputsettings-rowlength
         */
        readonly rowLength?: number;
    }
}

/**
 * Determine whether the given properties match those of a `FecOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FecOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FecOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('columnDepth', cdk.validateNumber)(properties.columnDepth));
    errors.collect(cdk.propertyValidator('includeFec', cdk.validateString)(properties.includeFec));
    errors.collect(cdk.propertyValidator('rowLength', cdk.validateNumber)(properties.rowLength));
    return errors.wrap('supplied properties not correct for "FecOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FecOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `FecOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FecOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFecOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FecOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        ColumnDepth: cdk.numberToCloudFormation(properties.columnDepth),
        IncludeFec: cdk.stringToCloudFormation(properties.includeFec),
        RowLength: cdk.numberToCloudFormation(properties.rowLength),
    };
}

// @ts-ignore TS6133
function CfnChannelFecOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FecOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FecOutputSettingsProperty>();
    ret.addPropertyResult('columnDepth', 'ColumnDepth', properties.ColumnDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.ColumnDepth) : undefined);
    ret.addPropertyResult('includeFec', 'IncludeFec', properties.IncludeFec != null ? cfn_parse.FromCloudFormation.getString(properties.IncludeFec) : undefined);
    ret.addPropertyResult('rowLength', 'RowLength', properties.RowLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.RowLength) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for the fMP4 containers.
     *
     * The parent of this entity is HlsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fmp4hlssettings.html
     */
    export interface Fmp4HlsSettingsProperty {
        /**
         * List all the audio groups that are used with the video output stream. Input all the audio GROUP-IDs that are associated to the video, separate by ','.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fmp4hlssettings.html#cfn-medialive-channel-fmp4hlssettings-audiorenditionsets
         */
        readonly audioRenditionSets?: string;
        /**
         * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fmp4hlssettings.html#cfn-medialive-channel-fmp4hlssettings-nielsenid3behavior
         */
        readonly nielsenId3Behavior?: string;
        /**
         * When set to passthrough, timed metadata is passed through from input to output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-fmp4hlssettings.html#cfn-medialive-channel-fmp4hlssettings-timedmetadatabehavior
         */
        readonly timedMetadataBehavior?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Fmp4HlsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Fmp4HlsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Fmp4HlsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioRenditionSets', cdk.validateString)(properties.audioRenditionSets));
    errors.collect(cdk.propertyValidator('nielsenId3Behavior', cdk.validateString)(properties.nielsenId3Behavior));
    errors.collect(cdk.propertyValidator('timedMetadataBehavior', cdk.validateString)(properties.timedMetadataBehavior));
    return errors.wrap('supplied properties not correct for "Fmp4HlsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Fmp4HlsSettings` resource
 *
 * @param properties - the TypeScript properties of a `Fmp4HlsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Fmp4HlsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFmp4HlsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Fmp4HlsSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioRenditionSets: cdk.stringToCloudFormation(properties.audioRenditionSets),
        NielsenId3Behavior: cdk.stringToCloudFormation(properties.nielsenId3Behavior),
        TimedMetadataBehavior: cdk.stringToCloudFormation(properties.timedMetadataBehavior),
    };
}

// @ts-ignore TS6133
function CfnChannelFmp4HlsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Fmp4HlsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Fmp4HlsSettingsProperty>();
    ret.addPropertyResult('audioRenditionSets', 'AudioRenditionSets', properties.AudioRenditionSets != null ? cfn_parse.FromCloudFormation.getString(properties.AudioRenditionSets) : undefined);
    ret.addPropertyResult('nielsenId3Behavior', 'NielsenId3Behavior', properties.NielsenId3Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.NielsenId3Behavior) : undefined);
    ret.addPropertyResult('timedMetadataBehavior', 'TimedMetadataBehavior', properties.TimedMetadataBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataBehavior) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure the destination of a Frame Capture output.
     *
     * The parent of this entity is FrameCaptureGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturecdnsettings.html
     */
    export interface FrameCaptureCdnSettingsProperty {
        /**
         * Sets up Amazon S3 as the destination for this Frame Capture output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturecdnsettings.html#cfn-medialive-channel-framecapturecdnsettings-framecaptures3settings
         */
        readonly frameCaptureS3Settings?: CfnChannel.FrameCaptureS3SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureCdnSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureCdnSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureCdnSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('frameCaptureS3Settings', CfnChannel_FrameCaptureS3SettingsPropertyValidator)(properties.frameCaptureS3Settings));
    return errors.wrap('supplied properties not correct for "FrameCaptureCdnSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureCdnSettings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureCdnSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureCdnSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureCdnSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureCdnSettingsPropertyValidator(properties).assertSuccess();
    return {
        FrameCaptureS3Settings: cfnChannelFrameCaptureS3SettingsPropertyToCloudFormation(properties.frameCaptureS3Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureCdnSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureCdnSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureCdnSettingsProperty>();
    ret.addPropertyResult('frameCaptureS3Settings', 'FrameCaptureS3Settings', properties.FrameCaptureS3Settings != null ? CfnChannelFrameCaptureS3SettingsPropertyFromCloudFormation(properties.FrameCaptureS3Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a frame capture output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturegroupsettings.html
     */
    export interface FrameCaptureGroupSettingsProperty {
        /**
         * The destination for the frame capture files. The destination is either the URI for an Amazon S3 bucket and object, plus a file name prefix (for example, s3ssl://sportsDelivery/highlights/20180820/curling_) or the URI for a MediaStore container, plus a file name prefix (for example, mediastoressl://sportsDelivery/20180820/curling_). The final file names consist of the prefix from the destination field (for example, "curling_") + name modifier + the counter (5 digits, starting from 00001) + extension (which is always .jpg). For example, curlingLow.00001.jpg.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturegroupsettings.html#cfn-medialive-channel-framecapturegroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * Settings to configure the destination of a Frame Capture output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturegroupsettings.html#cfn-medialive-channel-framecapturegroupsettings-framecapturecdnsettings
         */
        readonly frameCaptureCdnSettings?: CfnChannel.FrameCaptureCdnSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('frameCaptureCdnSettings', CfnChannel_FrameCaptureCdnSettingsPropertyValidator)(properties.frameCaptureCdnSettings));
    return errors.wrap('supplied properties not correct for "FrameCaptureGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        FrameCaptureCdnSettings: cfnChannelFrameCaptureCdnSettingsPropertyToCloudFormation(properties.frameCaptureCdnSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureGroupSettingsProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('frameCaptureCdnSettings', 'FrameCaptureCdnSettings', properties.FrameCaptureCdnSettings != null ? CfnChannelFrameCaptureCdnSettingsPropertyFromCloudFormation(properties.FrameCaptureCdnSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for a frame capture output in an HLS output group.
     *
     * The parent of this entity is HlsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturehlssettings.html
     */
    export interface FrameCaptureHlsSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureHlsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureHlsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureHlsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "FrameCaptureHlsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureHlsSettings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureHlsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureHlsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureHlsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureHlsSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureHlsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureHlsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureHlsSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The frame capture output settings.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptureoutputsettings.html
     */
    export interface FrameCaptureOutputSettingsProperty {
        /**
         * Required if the output group contains more than one output. This modifier forms part of the output file name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptureoutputsettings.html#cfn-medialive-channel-framecaptureoutputsettings-namemodifier
         */
        readonly nameModifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nameModifier', cdk.validateString)(properties.nameModifier));
    return errors.wrap('supplied properties not correct for "FrameCaptureOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        NameModifier: cdk.stringToCloudFormation(properties.nameModifier),
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureOutputSettingsProperty>();
    ret.addPropertyResult('nameModifier', 'NameModifier', properties.NameModifier != null ? cfn_parse.FromCloudFormation.getString(properties.NameModifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Sets up Amazon S3 as the destination for this Frame Capture output.
     *
     * The parent of this entity is FrameCaptureCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptures3settings.html
     */
    export interface FrameCaptureS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptures3settings.html#cfn-medialive-channel-framecaptures3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureS3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureS3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureS3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cannedAcl', cdk.validateString)(properties.cannedAcl));
    return errors.wrap('supplied properties not correct for "FrameCaptureS3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureS3Settings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureS3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureS3Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureS3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureS3SettingsPropertyValidator(properties).assertSuccess();
    return {
        CannedAcl: cdk.stringToCloudFormation(properties.cannedAcl),
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureS3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureS3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureS3SettingsProperty>();
    ret.addPropertyResult('cannedAcl', 'CannedAcl', properties.CannedAcl != null ? cfn_parse.FromCloudFormation.getString(properties.CannedAcl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The frame capture settings.
     *
     * The parent of this entity is VideoCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturesettings.html
     */
    export interface FrameCaptureSettingsProperty {
        /**
         * The frequency, in seconds, for capturing frames for inclusion in the output. For example, "10" means capture a frame every 10 seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturesettings.html#cfn-medialive-channel-framecapturesettings-captureinterval
         */
        readonly captureInterval?: number;
        /**
         * Unit for the frame capture interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturesettings.html#cfn-medialive-channel-framecapturesettings-captureintervalunits
         */
        readonly captureIntervalUnits?: string;
    }
}

/**
 * Determine whether the given properties match those of a `FrameCaptureSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `FrameCaptureSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_FrameCaptureSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('captureInterval', cdk.validateNumber)(properties.captureInterval));
    errors.collect(cdk.propertyValidator('captureIntervalUnits', cdk.validateString)(properties.captureIntervalUnits));
    return errors.wrap('supplied properties not correct for "FrameCaptureSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureSettings` resource
 *
 * @param properties - the TypeScript properties of a `FrameCaptureSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.FrameCaptureSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelFrameCaptureSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_FrameCaptureSettingsPropertyValidator(properties).assertSuccess();
    return {
        CaptureInterval: cdk.numberToCloudFormation(properties.captureInterval),
        CaptureIntervalUnits: cdk.stringToCloudFormation(properties.captureIntervalUnits),
    };
}

// @ts-ignore TS6133
function CfnChannelFrameCaptureSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.FrameCaptureSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.FrameCaptureSettingsProperty>();
    ret.addPropertyResult('captureInterval', 'CaptureInterval', properties.CaptureInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CaptureInterval) : undefined);
    ret.addPropertyResult('captureIntervalUnits', 'CaptureIntervalUnits', properties.CaptureIntervalUnits != null ? cfn_parse.FromCloudFormation.getString(properties.CaptureIntervalUnits) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration settings that apply to the entire channel.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html
     */
    export interface GlobalConfigurationProperty {
        /**
         * The value to set the initial audio gain for the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-initialaudiogain
         */
        readonly initialAudioGain?: number;
        /**
         * Indicates the action to take when the current input completes (for example, end-of-file). When switchAndLoopInputs is configured, MediaLive restarts at the beginning of the first input. When "none" is configured, MediaLive transcodes either black, a solid color, or a user-specified slate images per the "Input Loss Behavior" configuration until the next input switch occurs (which is controlled through the Channel Schedule API).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-inputendaction
         */
        readonly inputEndAction?: string;
        /**
         * The settings for system actions when the input is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-inputlossbehavior
         */
        readonly inputLossBehavior?: CfnChannel.InputLossBehaviorProperty | cdk.IResolvable;
        /**
         * Indicates how MediaLive pipelines are synchronized. PIPELINELOCKING - MediaLive attempts to synchronize the output of each pipeline to the other. EPOCHLOCKING - MediaLive attempts to synchronize the output of each pipeline to the Unix epoch.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-outputlockingmode
         */
        readonly outputLockingMode?: string;
        /**
         * Indicates whether the rate of frames emitted by the Live encoder should be paced by its system clock (which optionally might be locked to another source through NTP) or should be locked to the clock of the source that is providing the input stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-outputtimingsource
         */
        readonly outputTimingSource?: string;
        /**
         * Adjusts the video input buffer for streams with very low video frame rates. This is commonly set to enabled for music channels with less than one video frame per second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-globalconfiguration.html#cfn-medialive-channel-globalconfiguration-supportlowframerateinputs
         */
        readonly supportLowFramerateInputs?: string;
    }
}

/**
 * Determine whether the given properties match those of a `GlobalConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GlobalConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_GlobalConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('initialAudioGain', cdk.validateNumber)(properties.initialAudioGain));
    errors.collect(cdk.propertyValidator('inputEndAction', cdk.validateString)(properties.inputEndAction));
    errors.collect(cdk.propertyValidator('inputLossBehavior', CfnChannel_InputLossBehaviorPropertyValidator)(properties.inputLossBehavior));
    errors.collect(cdk.propertyValidator('outputLockingMode', cdk.validateString)(properties.outputLockingMode));
    errors.collect(cdk.propertyValidator('outputTimingSource', cdk.validateString)(properties.outputTimingSource));
    errors.collect(cdk.propertyValidator('supportLowFramerateInputs', cdk.validateString)(properties.supportLowFramerateInputs));
    return errors.wrap('supplied properties not correct for "GlobalConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.GlobalConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `GlobalConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.GlobalConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnChannelGlobalConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_GlobalConfigurationPropertyValidator(properties).assertSuccess();
    return {
        InitialAudioGain: cdk.numberToCloudFormation(properties.initialAudioGain),
        InputEndAction: cdk.stringToCloudFormation(properties.inputEndAction),
        InputLossBehavior: cfnChannelInputLossBehaviorPropertyToCloudFormation(properties.inputLossBehavior),
        OutputLockingMode: cdk.stringToCloudFormation(properties.outputLockingMode),
        OutputTimingSource: cdk.stringToCloudFormation(properties.outputTimingSource),
        SupportLowFramerateInputs: cdk.stringToCloudFormation(properties.supportLowFramerateInputs),
    };
}

// @ts-ignore TS6133
function CfnChannelGlobalConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.GlobalConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.GlobalConfigurationProperty>();
    ret.addPropertyResult('initialAudioGain', 'InitialAudioGain', properties.InitialAudioGain != null ? cfn_parse.FromCloudFormation.getNumber(properties.InitialAudioGain) : undefined);
    ret.addPropertyResult('inputEndAction', 'InputEndAction', properties.InputEndAction != null ? cfn_parse.FromCloudFormation.getString(properties.InputEndAction) : undefined);
    ret.addPropertyResult('inputLossBehavior', 'InputLossBehavior', properties.InputLossBehavior != null ? CfnChannelInputLossBehaviorPropertyFromCloudFormation(properties.InputLossBehavior) : undefined);
    ret.addPropertyResult('outputLockingMode', 'OutputLockingMode', properties.OutputLockingMode != null ? cfn_parse.FromCloudFormation.getString(properties.OutputLockingMode) : undefined);
    ret.addPropertyResult('outputTimingSource', 'OutputTimingSource', properties.OutputTimingSource != null ? cfn_parse.FromCloudFormation.getString(properties.OutputTimingSource) : undefined);
    ret.addPropertyResult('supportLowFramerateInputs', 'SupportLowFramerateInputs', properties.SupportLowFramerateInputs != null ? cfn_parse.FromCloudFormation.getString(properties.SupportLowFramerateInputs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for configuring color space in an H264 video encode.
     *
     * The parent of this entity is H264Settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264colorspacesettings.html
     */
    export interface H264ColorSpaceSettingsProperty {
        /**
         * Passthrough applies no color space conversion to the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264colorspacesettings.html#cfn-medialive-channel-h264colorspacesettings-colorspacepassthroughsettings
         */
        readonly colorSpacePassthroughSettings?: CfnChannel.ColorSpacePassthroughSettingsProperty | cdk.IResolvable;
        /**
         * Settings to configure the handling of Rec601 color space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264colorspacesettings.html#cfn-medialive-channel-h264colorspacesettings-rec601settings
         */
        readonly rec601Settings?: CfnChannel.Rec601SettingsProperty | cdk.IResolvable;
        /**
         * Settings to configure the handling of Rec709 color space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264colorspacesettings.html#cfn-medialive-channel-h264colorspacesettings-rec709settings
         */
        readonly rec709Settings?: CfnChannel.Rec709SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `H264ColorSpaceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H264ColorSpaceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H264ColorSpaceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('colorSpacePassthroughSettings', CfnChannel_ColorSpacePassthroughSettingsPropertyValidator)(properties.colorSpacePassthroughSettings));
    errors.collect(cdk.propertyValidator('rec601Settings', CfnChannel_Rec601SettingsPropertyValidator)(properties.rec601Settings));
    errors.collect(cdk.propertyValidator('rec709Settings', CfnChannel_Rec709SettingsPropertyValidator)(properties.rec709Settings));
    return errors.wrap('supplied properties not correct for "H264ColorSpaceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264ColorSpaceSettings` resource
 *
 * @param properties - the TypeScript properties of a `H264ColorSpaceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264ColorSpaceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH264ColorSpaceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H264ColorSpaceSettingsPropertyValidator(properties).assertSuccess();
    return {
        ColorSpacePassthroughSettings: cfnChannelColorSpacePassthroughSettingsPropertyToCloudFormation(properties.colorSpacePassthroughSettings),
        Rec601Settings: cfnChannelRec601SettingsPropertyToCloudFormation(properties.rec601Settings),
        Rec709Settings: cfnChannelRec709SettingsPropertyToCloudFormation(properties.rec709Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelH264ColorSpaceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H264ColorSpaceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H264ColorSpaceSettingsProperty>();
    ret.addPropertyResult('colorSpacePassthroughSettings', 'ColorSpacePassthroughSettings', properties.ColorSpacePassthroughSettings != null ? CfnChannelColorSpacePassthroughSettingsPropertyFromCloudFormation(properties.ColorSpacePassthroughSettings) : undefined);
    ret.addPropertyResult('rec601Settings', 'Rec601Settings', properties.Rec601Settings != null ? CfnChannelRec601SettingsPropertyFromCloudFormation(properties.Rec601Settings) : undefined);
    ret.addPropertyResult('rec709Settings', 'Rec709Settings', properties.Rec709Settings != null ? CfnChannelRec709SettingsPropertyFromCloudFormation(properties.Rec709Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure video filters that apply to the H264 codec.
     *
     * The parent of this entity is H264Settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264filtersettings.html
     */
    export interface H264FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264filtersettings.html#cfn-medialive-channel-h264filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `H264FilterSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H264FilterSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H264FilterSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('temporalFilterSettings', CfnChannel_TemporalFilterSettingsPropertyValidator)(properties.temporalFilterSettings));
    return errors.wrap('supplied properties not correct for "H264FilterSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264FilterSettings` resource
 *
 * @param properties - the TypeScript properties of a `H264FilterSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264FilterSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH264FilterSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H264FilterSettingsPropertyValidator(properties).assertSuccess();
    return {
        TemporalFilterSettings: cfnChannelTemporalFilterSettingsPropertyToCloudFormation(properties.temporalFilterSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelH264FilterSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H264FilterSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H264FilterSettingsProperty>();
    ret.addPropertyResult('temporalFilterSettings', 'TemporalFilterSettings', properties.TemporalFilterSettings != null ? CfnChannelTemporalFilterSettingsPropertyFromCloudFormation(properties.TemporalFilterSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the H.264 codec in the output.
     *
     * The parent of this entity is VideoCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html
     */
    export interface H264SettingsProperty {
        /**
         * The adaptive quantization. This allows intra-frame quantizers to vary to improve visual quality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-adaptivequantization
         */
        readonly adaptiveQuantization?: string;
        /**
         * Indicates that AFD values will be written into the output stream. If afdSignaling is auto, the system tries to preserve the input AFD value (in cases where multiple AFD values are valid). If set to fixed, the AFD value is the value configured in the fixedAfd parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-afdsignaling
         */
        readonly afdSignaling?: string;
        /**
         * The average bitrate in bits/second. This is required when the rate control mode is VBR or CBR. It isn't used for QVBR. In a Microsoft Smooth output group, each output must have a unique value when its bitrate is rounded down to the nearest multiple of 1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-bitrate
         */
        readonly bitrate?: number;
        /**
         * The percentage of the buffer that should initially be filled (HRD buffer model).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-buffillpct
         */
        readonly bufFillPct?: number;
        /**
         * The size of the buffer (HRD buffer model) in bits/second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-bufsize
         */
        readonly bufSize?: number;
        /**
         * Includes color space metadata in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-colormetadata
         */
        readonly colorMetadata?: string;
        /**
         * Settings to configure the color space handling for the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-colorspacesettings
         */
        readonly colorSpaceSettings?: CfnChannel.H264ColorSpaceSettingsProperty | cdk.IResolvable;
        /**
         * The entropy encoding mode. Use cabac (must be in Main or High profile) or cavlc.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-entropyencoding
         */
        readonly entropyEncoding?: string;
        /**
         * Optional filters that you can apply to an encode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-filtersettings
         */
        readonly filterSettings?: CfnChannel.H264FilterSettingsProperty | cdk.IResolvable;
        /**
         * A four-bit AFD value to write on all frames of video in the output stream. Valid only when afdSignaling is set to Fixed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-fixedafd
         */
        readonly fixedAfd?: string;
        /**
         * If set to enabled, adjusts the quantization within each frame to reduce flicker or pop on I-frames.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-flickeraq
         */
        readonly flickerAq?: string;
        /**
         * This setting applies only when scan type is "interlaced." It controls whether coding is performed on a field basis or on a frame basis. (When the video is progressive, the coding is always performed on a frame basis.)
         * enabled: Force MediaLive to code on a field basis, so that odd and even sets of fields are coded separately.
         * disabled: Code the two sets of fields separately (on a field basis) or together (on a frame basis using PAFF), depending on what is most appropriate for the content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-forcefieldpictures
         */
        readonly forceFieldPictures?: string;
        /**
         * Indicates how the output video frame rate is specified. If you select "specified," the output video frame rate is determined by framerateNumerator and framerateDenominator. If you select "initializeFromSource," the output video frame rate is set equal to the input video frame rate of the first input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-frameratecontrol
         */
        readonly framerateControl?: string;
        /**
         * The frame rate denominator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-frameratedenominator
         */
        readonly framerateDenominator?: number;
        /**
         * The frame rate numerator. The frame rate is a fraction, for example, 24000/1001 = 23.976 fps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-frameratenumerator
         */
        readonly framerateNumerator?: number;
        /**
         * If enabled, uses reference B frames for GOP structures that have B frames > 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-gopbreference
         */
        readonly gopBReference?: string;
        /**
         * The frequency of closed GOPs. In streaming applications, we recommend that you set this to 1 so that a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-gopclosedcadence
         */
        readonly gopClosedCadence?: number;
        /**
         * The number of B-frames between reference frames.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-gopnumbframes
         */
        readonly gopNumBFrames?: number;
        /**
         * The GOP size (keyframe interval) in units of either frames or seconds per gopSizeUnits. The value must be greater than zero.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-gopsize
         */
        readonly gopSize?: number;
        /**
         * Indicates if the gopSize is specified in frames or seconds. If seconds, the system converts the gopSize into a frame count at runtime.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-gopsizeunits
         */
        readonly gopSizeUnits?: string;
        /**
         * The H.264 level.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-level
         */
        readonly level?: string;
        /**
         * The amount of lookahead. A value of low can decrease latency and memory usage, while high can produce better quality for certain content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-lookaheadratecontrol
         */
        readonly lookAheadRateControl?: string;
        /**
         * For QVBR: See the tooltip for Quality level. For VBR: Set the maximum bitrate in order to accommodate expected spikes in the complexity of the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-maxbitrate
         */
        readonly maxBitrate?: number;
        /**
         * Meaningful only if sceneChangeDetect is set to enabled. This setting enforces separation between repeated (cadence) I-frames and I-frames inserted by Scene Change Detection. If a scene change I-frame is within I-interval frames of a cadence I-frame, the GOP is shrunk or stretched to the scene change I-frame. GOP stretch requires enabling lookahead as well as setting the I-interval. The normal cadence resumes for the next GOP. Note that the maximum GOP stretch = GOP size + Min-I-interval - 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-miniinterval
         */
        readonly minIInterval?: number;
        /**
         * The number of reference frames to use. The encoder might use more than requested if you use B-frames or interlaced encoding.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-numrefframes
         */
        readonly numRefFrames?: number;
        /**
         * Indicates how the output pixel aspect ratio is specified. If "specified" is selected, the output video pixel aspect ratio is determined by parNumerator and parDenominator. If "initializeFromSource" is selected, the output pixels aspect ratio will be set equal to the input video pixel aspect ratio of the first input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-parcontrol
         */
        readonly parControl?: string;
        /**
         * The Pixel Aspect Ratio denominator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-pardenominator
         */
        readonly parDenominator?: number;
        /**
         * The Pixel Aspect Ratio numerator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-parnumerator
         */
        readonly parNumerator?: number;
        /**
         * An H.264 profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-profile
         */
        readonly profile?: string;
        /**
         * Leave as STANDARD_QUALITY or choose a different value (which might result in additional costs to run the channel).
         * - ENHANCED_QUALITY: Produces a slightly better video quality without an increase in the bitrate. Has an effect only when the Rate control mode is QVBR or CBR. If this channel is in a MediaLive multiplex, the value must be ENHANCED_QUALITY.
         * - STANDARD_QUALITY: Valid for any Rate control mode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-qualitylevel
         */
        readonly qualityLevel?: string;
        /**
         * Controls the target quality for the video encode. This applies only when the rate control mode is QVBR. Set values for the QVBR quality level field and Max bitrate field that suit your most important viewing devices. Recommended values are: - Primary screen: Quality level: 8 to 10. Max bitrate: 4M - PC or tablet: Quality level: 7. Max bitrate: 1.5M to 3M - Smartphone: Quality level: 6. Max bitrate: 1M to 1.5M.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-qvbrqualitylevel
         */
        readonly qvbrQualityLevel?: number;
        /**
         * The rate control mode. QVBR: The quality will match the specified quality level except when it is constrained by the maximum bitrate. We recommend this if you or your viewers pay for bandwidth. VBR: The quality and bitrate vary, depending on the video complexity. We recommend this instead of QVBR if you want to maintain a specific average bitrate over the duration of the channel. CBR: The quality varies, depending on the video complexity. We recommend this only if you distribute your assets to devices that can't handle variable bitrates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-ratecontrolmode
         */
        readonly rateControlMode?: string;
        /**
         * Sets the scan type of the output to progressive or top-field-first interlaced.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-scantype
         */
        readonly scanType?: string;
        /**
         * The scene change detection. On: inserts I-frames when the scene change is detected. Off: does not force an I-frame when the scene change is detected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-scenechangedetect
         */
        readonly sceneChangeDetect?: string;
        /**
         * The number of slices per picture. The number must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures. This field is optional. If you don't specify a value, MediaLive chooses the number of slices based on the encode resolution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-slices
         */
        readonly slices?: number;
        /**
         * Softness. Selects a quantizer matrix. Larger values reduce high-frequency content in the encoded image.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-softness
         */
        readonly softness?: number;
        /**
         * If set to enabled, adjusts quantization within each frame based on the spatial variation of content complexity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-spatialaq
         */
        readonly spatialAq?: string;
        /**
         * If set to fixed, uses gopNumBFrames B-frames per sub-GOP. If set to dynamic, optimizes the number of B-frames used for each sub-GOP to improve visual quality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-subgoplength
         */
        readonly subgopLength?: string;
        /**
         * Produces a bitstream that is compliant with SMPTE RP-2027.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-syntax
         */
        readonly syntax?: string;
        /**
         * If set to enabled, adjusts quantization within each frame based on the temporal variation of content complexity.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-temporalaq
         */
        readonly temporalAq?: string;
        /**
         * Determines how timecodes should be inserted into the video elementary stream. disabled: don't include timecodes. picTimingSei: pass through picture timing SEI messages from the source specified in Timecode Config.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264settings.html#cfn-medialive-channel-h264settings-timecodeinsertion
         */
        readonly timecodeInsertion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `H264SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H264SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H264SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adaptiveQuantization', cdk.validateString)(properties.adaptiveQuantization));
    errors.collect(cdk.propertyValidator('afdSignaling', cdk.validateString)(properties.afdSignaling));
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('bufFillPct', cdk.validateNumber)(properties.bufFillPct));
    errors.collect(cdk.propertyValidator('bufSize', cdk.validateNumber)(properties.bufSize));
    errors.collect(cdk.propertyValidator('colorMetadata', cdk.validateString)(properties.colorMetadata));
    errors.collect(cdk.propertyValidator('colorSpaceSettings', CfnChannel_H264ColorSpaceSettingsPropertyValidator)(properties.colorSpaceSettings));
    errors.collect(cdk.propertyValidator('entropyEncoding', cdk.validateString)(properties.entropyEncoding));
    errors.collect(cdk.propertyValidator('filterSettings', CfnChannel_H264FilterSettingsPropertyValidator)(properties.filterSettings));
    errors.collect(cdk.propertyValidator('fixedAfd', cdk.validateString)(properties.fixedAfd));
    errors.collect(cdk.propertyValidator('flickerAq', cdk.validateString)(properties.flickerAq));
    errors.collect(cdk.propertyValidator('forceFieldPictures', cdk.validateString)(properties.forceFieldPictures));
    errors.collect(cdk.propertyValidator('framerateControl', cdk.validateString)(properties.framerateControl));
    errors.collect(cdk.propertyValidator('framerateDenominator', cdk.validateNumber)(properties.framerateDenominator));
    errors.collect(cdk.propertyValidator('framerateNumerator', cdk.validateNumber)(properties.framerateNumerator));
    errors.collect(cdk.propertyValidator('gopBReference', cdk.validateString)(properties.gopBReference));
    errors.collect(cdk.propertyValidator('gopClosedCadence', cdk.validateNumber)(properties.gopClosedCadence));
    errors.collect(cdk.propertyValidator('gopNumBFrames', cdk.validateNumber)(properties.gopNumBFrames));
    errors.collect(cdk.propertyValidator('gopSize', cdk.validateNumber)(properties.gopSize));
    errors.collect(cdk.propertyValidator('gopSizeUnits', cdk.validateString)(properties.gopSizeUnits));
    errors.collect(cdk.propertyValidator('level', cdk.validateString)(properties.level));
    errors.collect(cdk.propertyValidator('lookAheadRateControl', cdk.validateString)(properties.lookAheadRateControl));
    errors.collect(cdk.propertyValidator('maxBitrate', cdk.validateNumber)(properties.maxBitrate));
    errors.collect(cdk.propertyValidator('minIInterval', cdk.validateNumber)(properties.minIInterval));
    errors.collect(cdk.propertyValidator('numRefFrames', cdk.validateNumber)(properties.numRefFrames));
    errors.collect(cdk.propertyValidator('parControl', cdk.validateString)(properties.parControl));
    errors.collect(cdk.propertyValidator('parDenominator', cdk.validateNumber)(properties.parDenominator));
    errors.collect(cdk.propertyValidator('parNumerator', cdk.validateNumber)(properties.parNumerator));
    errors.collect(cdk.propertyValidator('profile', cdk.validateString)(properties.profile));
    errors.collect(cdk.propertyValidator('qualityLevel', cdk.validateString)(properties.qualityLevel));
    errors.collect(cdk.propertyValidator('qvbrQualityLevel', cdk.validateNumber)(properties.qvbrQualityLevel));
    errors.collect(cdk.propertyValidator('rateControlMode', cdk.validateString)(properties.rateControlMode));
    errors.collect(cdk.propertyValidator('scanType', cdk.validateString)(properties.scanType));
    errors.collect(cdk.propertyValidator('sceneChangeDetect', cdk.validateString)(properties.sceneChangeDetect));
    errors.collect(cdk.propertyValidator('slices', cdk.validateNumber)(properties.slices));
    errors.collect(cdk.propertyValidator('softness', cdk.validateNumber)(properties.softness));
    errors.collect(cdk.propertyValidator('spatialAq', cdk.validateString)(properties.spatialAq));
    errors.collect(cdk.propertyValidator('subgopLength', cdk.validateString)(properties.subgopLength));
    errors.collect(cdk.propertyValidator('syntax', cdk.validateString)(properties.syntax));
    errors.collect(cdk.propertyValidator('temporalAq', cdk.validateString)(properties.temporalAq));
    errors.collect(cdk.propertyValidator('timecodeInsertion', cdk.validateString)(properties.timecodeInsertion));
    return errors.wrap('supplied properties not correct for "H264SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264Settings` resource
 *
 * @param properties - the TypeScript properties of a `H264SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H264Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH264SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H264SettingsPropertyValidator(properties).assertSuccess();
    return {
        AdaptiveQuantization: cdk.stringToCloudFormation(properties.adaptiveQuantization),
        AfdSignaling: cdk.stringToCloudFormation(properties.afdSignaling),
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        BufFillPct: cdk.numberToCloudFormation(properties.bufFillPct),
        BufSize: cdk.numberToCloudFormation(properties.bufSize),
        ColorMetadata: cdk.stringToCloudFormation(properties.colorMetadata),
        ColorSpaceSettings: cfnChannelH264ColorSpaceSettingsPropertyToCloudFormation(properties.colorSpaceSettings),
        EntropyEncoding: cdk.stringToCloudFormation(properties.entropyEncoding),
        FilterSettings: cfnChannelH264FilterSettingsPropertyToCloudFormation(properties.filterSettings),
        FixedAfd: cdk.stringToCloudFormation(properties.fixedAfd),
        FlickerAq: cdk.stringToCloudFormation(properties.flickerAq),
        ForceFieldPictures: cdk.stringToCloudFormation(properties.forceFieldPictures),
        FramerateControl: cdk.stringToCloudFormation(properties.framerateControl),
        FramerateDenominator: cdk.numberToCloudFormation(properties.framerateDenominator),
        FramerateNumerator: cdk.numberToCloudFormation(properties.framerateNumerator),
        GopBReference: cdk.stringToCloudFormation(properties.gopBReference),
        GopClosedCadence: cdk.numberToCloudFormation(properties.gopClosedCadence),
        GopNumBFrames: cdk.numberToCloudFormation(properties.gopNumBFrames),
        GopSize: cdk.numberToCloudFormation(properties.gopSize),
        GopSizeUnits: cdk.stringToCloudFormation(properties.gopSizeUnits),
        Level: cdk.stringToCloudFormation(properties.level),
        LookAheadRateControl: cdk.stringToCloudFormation(properties.lookAheadRateControl),
        MaxBitrate: cdk.numberToCloudFormation(properties.maxBitrate),
        MinIInterval: cdk.numberToCloudFormation(properties.minIInterval),
        NumRefFrames: cdk.numberToCloudFormation(properties.numRefFrames),
        ParControl: cdk.stringToCloudFormation(properties.parControl),
        ParDenominator: cdk.numberToCloudFormation(properties.parDenominator),
        ParNumerator: cdk.numberToCloudFormation(properties.parNumerator),
        Profile: cdk.stringToCloudFormation(properties.profile),
        QualityLevel: cdk.stringToCloudFormation(properties.qualityLevel),
        QvbrQualityLevel: cdk.numberToCloudFormation(properties.qvbrQualityLevel),
        RateControlMode: cdk.stringToCloudFormation(properties.rateControlMode),
        ScanType: cdk.stringToCloudFormation(properties.scanType),
        SceneChangeDetect: cdk.stringToCloudFormation(properties.sceneChangeDetect),
        Slices: cdk.numberToCloudFormation(properties.slices),
        Softness: cdk.numberToCloudFormation(properties.softness),
        SpatialAq: cdk.stringToCloudFormation(properties.spatialAq),
        SubgopLength: cdk.stringToCloudFormation(properties.subgopLength),
        Syntax: cdk.stringToCloudFormation(properties.syntax),
        TemporalAq: cdk.stringToCloudFormation(properties.temporalAq),
        TimecodeInsertion: cdk.stringToCloudFormation(properties.timecodeInsertion),
    };
}

// @ts-ignore TS6133
function CfnChannelH264SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H264SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H264SettingsProperty>();
    ret.addPropertyResult('adaptiveQuantization', 'AdaptiveQuantization', properties.AdaptiveQuantization != null ? cfn_parse.FromCloudFormation.getString(properties.AdaptiveQuantization) : undefined);
    ret.addPropertyResult('afdSignaling', 'AfdSignaling', properties.AfdSignaling != null ? cfn_parse.FromCloudFormation.getString(properties.AfdSignaling) : undefined);
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('bufFillPct', 'BufFillPct', properties.BufFillPct != null ? cfn_parse.FromCloudFormation.getNumber(properties.BufFillPct) : undefined);
    ret.addPropertyResult('bufSize', 'BufSize', properties.BufSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BufSize) : undefined);
    ret.addPropertyResult('colorMetadata', 'ColorMetadata', properties.ColorMetadata != null ? cfn_parse.FromCloudFormation.getString(properties.ColorMetadata) : undefined);
    ret.addPropertyResult('colorSpaceSettings', 'ColorSpaceSettings', properties.ColorSpaceSettings != null ? CfnChannelH264ColorSpaceSettingsPropertyFromCloudFormation(properties.ColorSpaceSettings) : undefined);
    ret.addPropertyResult('entropyEncoding', 'EntropyEncoding', properties.EntropyEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.EntropyEncoding) : undefined);
    ret.addPropertyResult('filterSettings', 'FilterSettings', properties.FilterSettings != null ? CfnChannelH264FilterSettingsPropertyFromCloudFormation(properties.FilterSettings) : undefined);
    ret.addPropertyResult('fixedAfd', 'FixedAfd', properties.FixedAfd != null ? cfn_parse.FromCloudFormation.getString(properties.FixedAfd) : undefined);
    ret.addPropertyResult('flickerAq', 'FlickerAq', properties.FlickerAq != null ? cfn_parse.FromCloudFormation.getString(properties.FlickerAq) : undefined);
    ret.addPropertyResult('forceFieldPictures', 'ForceFieldPictures', properties.ForceFieldPictures != null ? cfn_parse.FromCloudFormation.getString(properties.ForceFieldPictures) : undefined);
    ret.addPropertyResult('framerateControl', 'FramerateControl', properties.FramerateControl != null ? cfn_parse.FromCloudFormation.getString(properties.FramerateControl) : undefined);
    ret.addPropertyResult('framerateDenominator', 'FramerateDenominator', properties.FramerateDenominator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateDenominator) : undefined);
    ret.addPropertyResult('framerateNumerator', 'FramerateNumerator', properties.FramerateNumerator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateNumerator) : undefined);
    ret.addPropertyResult('gopBReference', 'GopBReference', properties.GopBReference != null ? cfn_parse.FromCloudFormation.getString(properties.GopBReference) : undefined);
    ret.addPropertyResult('gopClosedCadence', 'GopClosedCadence', properties.GopClosedCadence != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopClosedCadence) : undefined);
    ret.addPropertyResult('gopNumBFrames', 'GopNumBFrames', properties.GopNumBFrames != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopNumBFrames) : undefined);
    ret.addPropertyResult('gopSize', 'GopSize', properties.GopSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopSize) : undefined);
    ret.addPropertyResult('gopSizeUnits', 'GopSizeUnits', properties.GopSizeUnits != null ? cfn_parse.FromCloudFormation.getString(properties.GopSizeUnits) : undefined);
    ret.addPropertyResult('level', 'Level', properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined);
    ret.addPropertyResult('lookAheadRateControl', 'LookAheadRateControl', properties.LookAheadRateControl != null ? cfn_parse.FromCloudFormation.getString(properties.LookAheadRateControl) : undefined);
    ret.addPropertyResult('maxBitrate', 'MaxBitrate', properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined);
    ret.addPropertyResult('minIInterval', 'MinIInterval', properties.MinIInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinIInterval) : undefined);
    ret.addPropertyResult('numRefFrames', 'NumRefFrames', properties.NumRefFrames != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRefFrames) : undefined);
    ret.addPropertyResult('parControl', 'ParControl', properties.ParControl != null ? cfn_parse.FromCloudFormation.getString(properties.ParControl) : undefined);
    ret.addPropertyResult('parDenominator', 'ParDenominator', properties.ParDenominator != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParDenominator) : undefined);
    ret.addPropertyResult('parNumerator', 'ParNumerator', properties.ParNumerator != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParNumerator) : undefined);
    ret.addPropertyResult('profile', 'Profile', properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined);
    ret.addPropertyResult('qualityLevel', 'QualityLevel', properties.QualityLevel != null ? cfn_parse.FromCloudFormation.getString(properties.QualityLevel) : undefined);
    ret.addPropertyResult('qvbrQualityLevel', 'QvbrQualityLevel', properties.QvbrQualityLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.QvbrQualityLevel) : undefined);
    ret.addPropertyResult('rateControlMode', 'RateControlMode', properties.RateControlMode != null ? cfn_parse.FromCloudFormation.getString(properties.RateControlMode) : undefined);
    ret.addPropertyResult('scanType', 'ScanType', properties.ScanType != null ? cfn_parse.FromCloudFormation.getString(properties.ScanType) : undefined);
    ret.addPropertyResult('sceneChangeDetect', 'SceneChangeDetect', properties.SceneChangeDetect != null ? cfn_parse.FromCloudFormation.getString(properties.SceneChangeDetect) : undefined);
    ret.addPropertyResult('slices', 'Slices', properties.Slices != null ? cfn_parse.FromCloudFormation.getNumber(properties.Slices) : undefined);
    ret.addPropertyResult('softness', 'Softness', properties.Softness != null ? cfn_parse.FromCloudFormation.getNumber(properties.Softness) : undefined);
    ret.addPropertyResult('spatialAq', 'SpatialAq', properties.SpatialAq != null ? cfn_parse.FromCloudFormation.getString(properties.SpatialAq) : undefined);
    ret.addPropertyResult('subgopLength', 'SubgopLength', properties.SubgopLength != null ? cfn_parse.FromCloudFormation.getString(properties.SubgopLength) : undefined);
    ret.addPropertyResult('syntax', 'Syntax', properties.Syntax != null ? cfn_parse.FromCloudFormation.getString(properties.Syntax) : undefined);
    ret.addPropertyResult('temporalAq', 'TemporalAq', properties.TemporalAq != null ? cfn_parse.FromCloudFormation.getString(properties.TemporalAq) : undefined);
    ret.addPropertyResult('timecodeInsertion', 'TimecodeInsertion', properties.TimecodeInsertion != null ? cfn_parse.FromCloudFormation.getString(properties.TimecodeInsertion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * H265 Color Space Settings
     *
     * The parent of this entity is H265Settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265colorspacesettings.html
     */
    export interface H265ColorSpaceSettingsProperty {
        /**
         * Passthrough applies no color space conversion to the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265colorspacesettings.html#cfn-medialive-channel-h265colorspacesettings-colorspacepassthroughsettings
         */
        readonly colorSpacePassthroughSettings?: CfnChannel.ColorSpacePassthroughSettingsProperty | cdk.IResolvable;
        /**
         * Settings to configure the handling of HDR10 color space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265colorspacesettings.html#cfn-medialive-channel-h265colorspacesettings-hdr10settings
         */
        readonly hdr10Settings?: CfnChannel.Hdr10SettingsProperty | cdk.IResolvable;
        /**
         * Settings to configure the handling of Rec601 color space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265colorspacesettings.html#cfn-medialive-channel-h265colorspacesettings-rec601settings
         */
        readonly rec601Settings?: CfnChannel.Rec601SettingsProperty | cdk.IResolvable;
        /**
         * Settings to configure the handling of Rec709 color space.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265colorspacesettings.html#cfn-medialive-channel-h265colorspacesettings-rec709settings
         */
        readonly rec709Settings?: CfnChannel.Rec709SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `H265ColorSpaceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H265ColorSpaceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H265ColorSpaceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('colorSpacePassthroughSettings', CfnChannel_ColorSpacePassthroughSettingsPropertyValidator)(properties.colorSpacePassthroughSettings));
    errors.collect(cdk.propertyValidator('hdr10Settings', CfnChannel_Hdr10SettingsPropertyValidator)(properties.hdr10Settings));
    errors.collect(cdk.propertyValidator('rec601Settings', CfnChannel_Rec601SettingsPropertyValidator)(properties.rec601Settings));
    errors.collect(cdk.propertyValidator('rec709Settings', CfnChannel_Rec709SettingsPropertyValidator)(properties.rec709Settings));
    return errors.wrap('supplied properties not correct for "H265ColorSpaceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265ColorSpaceSettings` resource
 *
 * @param properties - the TypeScript properties of a `H265ColorSpaceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265ColorSpaceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH265ColorSpaceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H265ColorSpaceSettingsPropertyValidator(properties).assertSuccess();
    return {
        ColorSpacePassthroughSettings: cfnChannelColorSpacePassthroughSettingsPropertyToCloudFormation(properties.colorSpacePassthroughSettings),
        Hdr10Settings: cfnChannelHdr10SettingsPropertyToCloudFormation(properties.hdr10Settings),
        Rec601Settings: cfnChannelRec601SettingsPropertyToCloudFormation(properties.rec601Settings),
        Rec709Settings: cfnChannelRec709SettingsPropertyToCloudFormation(properties.rec709Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelH265ColorSpaceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H265ColorSpaceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H265ColorSpaceSettingsProperty>();
    ret.addPropertyResult('colorSpacePassthroughSettings', 'ColorSpacePassthroughSettings', properties.ColorSpacePassthroughSettings != null ? CfnChannelColorSpacePassthroughSettingsPropertyFromCloudFormation(properties.ColorSpacePassthroughSettings) : undefined);
    ret.addPropertyResult('hdr10Settings', 'Hdr10Settings', properties.Hdr10Settings != null ? CfnChannelHdr10SettingsPropertyFromCloudFormation(properties.Hdr10Settings) : undefined);
    ret.addPropertyResult('rec601Settings', 'Rec601Settings', properties.Rec601Settings != null ? CfnChannelRec601SettingsPropertyFromCloudFormation(properties.Rec601Settings) : undefined);
    ret.addPropertyResult('rec709Settings', 'Rec709Settings', properties.Rec709Settings != null ? CfnChannelRec709SettingsPropertyFromCloudFormation(properties.Rec709Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure video filters that apply to the H265 codec.
     *
     * The parent of this entity is H265Settings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265filtersettings.html
     */
    export interface H265FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265filtersettings.html#cfn-medialive-channel-h265filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `H265FilterSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H265FilterSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H265FilterSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('temporalFilterSettings', CfnChannel_TemporalFilterSettingsPropertyValidator)(properties.temporalFilterSettings));
    return errors.wrap('supplied properties not correct for "H265FilterSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265FilterSettings` resource
 *
 * @param properties - the TypeScript properties of a `H265FilterSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265FilterSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH265FilterSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H265FilterSettingsPropertyValidator(properties).assertSuccess();
    return {
        TemporalFilterSettings: cfnChannelTemporalFilterSettingsPropertyToCloudFormation(properties.temporalFilterSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelH265FilterSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H265FilterSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H265FilterSettingsProperty>();
    ret.addPropertyResult('temporalFilterSettings', 'TemporalFilterSettings', properties.TemporalFilterSettings != null ? CfnChannelTemporalFilterSettingsPropertyFromCloudFormation(properties.TemporalFilterSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * H265 Settings
     *
     * The parent of this entity is VideoCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html
     */
    export interface H265SettingsProperty {
        /**
         * Adaptive quantization. Allows intra-frame quantizers to vary to improve visual quality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-adaptivequantization
         */
        readonly adaptiveQuantization?: string;
        /**
         * Indicates that AFD values will be written into the output stream. If afdSignaling is "auto", the system will try to preserve the input AFD value (in cases where multiple AFD values are valid). If set to "fixed", the AFD value will be the value configured in the fixedAfd parameter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-afdsignaling
         */
        readonly afdSignaling?: string;
        /**
         * Whether or not EML should insert an Alternative Transfer Function SEI message to support backwards compatibility with non-HDR decoders and displays.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-alternativetransferfunction
         */
        readonly alternativeTransferFunction?: string;
        /**
         * Average bitrate in bits/second. Required when the rate control mode is VBR or CBR. Not used for QVBR. In an MS Smooth output group, each output must have a unique value when its bitrate is rounded down to the nearest multiple of 1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-bitrate
         */
        readonly bitrate?: number;
        /**
         * Size of buffer (HRD buffer model) in bits.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-bufsize
         */
        readonly bufSize?: number;
        /**
         * Includes colorspace metadata in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-colormetadata
         */
        readonly colorMetadata?: string;
        /**
         * Color Space settings
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-colorspacesettings
         */
        readonly colorSpaceSettings?: CfnChannel.H265ColorSpaceSettingsProperty | cdk.IResolvable;
        /**
         * Optional filters that you can apply to an encode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-filtersettings
         */
        readonly filterSettings?: CfnChannel.H265FilterSettingsProperty | cdk.IResolvable;
        /**
         * Four bit AFD value to write on all frames of video in the output stream. Only valid when afdSignaling is set to 'Fixed'.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-fixedafd
         */
        readonly fixedAfd?: string;
        /**
         * If set to enabled, adjust quantization within each frame to reduce flicker or 'pop' on I-frames.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-flickeraq
         */
        readonly flickerAq?: string;
        /**
         * Framerate denominator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-frameratedenominator
         */
        readonly framerateDenominator?: number;
        /**
         * Framerate numerator - framerate is a fraction, e.g. 24000 / 1001 = 23.976 fps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-frameratenumerator
         */
        readonly framerateNumerator?: number;
        /**
         * Frequency of closed GOPs. In streaming applications, it is recommended that this be set to 1 so a decoder joining mid-stream will receive an IDR frame as quickly as possible. Setting this value to 0 will break output segmenting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-gopclosedcadence
         */
        readonly gopClosedCadence?: number;
        /**
         * GOP size (keyframe interval) in units of either frames or seconds per gopSizeUnits.
         * If gopSizeUnits is frames, gopSize must be an integer and must be greater than or equal to 1.
         * If gopSizeUnits is seconds, gopSize must be greater than 0, but need not be an integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-gopsize
         */
        readonly gopSize?: number;
        /**
         * Indicates if the gopSize is specified in frames or seconds. If seconds the system will convert the gopSize into a frame count at run time.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-gopsizeunits
         */
        readonly gopSizeUnits?: string;
        /**
         * H.265 Level.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-level
         */
        readonly level?: string;
        /**
         * Amount of lookahead. A value of low can decrease latency and memory usage, while high can produce better quality for certain content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-lookaheadratecontrol
         */
        readonly lookAheadRateControl?: string;
        /**
         * For QVBR: See the tooltip for Quality level
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-maxbitrate
         */
        readonly maxBitrate?: number;
        /**
         * Only meaningful if sceneChangeDetect is set to enabled. Defaults to 5 if multiplex rate control is used. Enforces separation between repeated (cadence) I-frames and I-frames inserted by Scene Change Detection. If a scene change I-frame is within I-interval frames of a cadence I-frame, the GOP is shrunk and/or stretched to the scene change I-frame. GOP stretch requires enabling lookahead as well as setting I-interval. The normal cadence resumes for the next GOP. Note: Maximum GOP stretch = GOP size + Min-I-interval - 1
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-miniinterval
         */
        readonly minIInterval?: number;
        /**
         * Pixel Aspect Ratio denominator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-pardenominator
         */
        readonly parDenominator?: number;
        /**
         * Pixel Aspect Ratio numerator.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-parnumerator
         */
        readonly parNumerator?: number;
        /**
         * H.265 Profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-profile
         */
        readonly profile?: string;
        /**
         * Controls the target quality for the video encode. Applies only when the rate control mode is QVBR. Set values for the QVBR quality level field and Max bitrate field that suit your most important viewing devices. Recommended values are:
         * - Primary screen: Quality level: 8 to 10. Max bitrate: 4M
         * - PC or tablet: Quality level: 7. Max bitrate: 1.5M to 3M
         * - Smartphone: Quality level: 6. Max bitrate: 1M to 1.5M
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-qvbrqualitylevel
         */
        readonly qvbrQualityLevel?: number;
        /**
         * Rate control mode. QVBR: Quality will match the specified quality level except when it is constrained by the
         * maximum bitrate. Recommended if you or your viewers pay for bandwidth. CBR: Quality varies, depending on the video complexity. Recommended only if you distribute
         * your assets to devices that cannot handle variable bitrates. Multiplex: This rate control mode is only supported (and is required) when the video is being
         * delivered to a MediaLive Multiplex in which case the rate control configuration is controlled
         * by the properties within the Multiplex Program.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-ratecontrolmode
         */
        readonly rateControlMode?: string;
        /**
         * Sets the scan type of the output to progressive or top-field-first interlaced.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-scantype
         */
        readonly scanType?: string;
        /**
         * Scene change detection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-scenechangedetect
         */
        readonly sceneChangeDetect?: string;
        /**
         * Number of slices per picture. Must be less than or equal to the number of macroblock rows for progressive pictures, and less than or equal to half the number of macroblock rows for interlaced pictures.
         * This field is optional; when no value is specified the encoder will choose the number of slices based on encode resolution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-slices
         */
        readonly slices?: number;
        /**
         * H.265 Tier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-tier
         */
        readonly tier?: string;
        /**
         * Determines how timecodes should be inserted into the video elementary stream.
         * - 'disabled': Do not include timecodes
         * - 'picTimingSei': Pass through picture timing SEI messages from the source specified in Timecode Config
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265settings.html#cfn-medialive-channel-h265settings-timecodeinsertion
         */
        readonly timecodeInsertion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `H265SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `H265SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_H265SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adaptiveQuantization', cdk.validateString)(properties.adaptiveQuantization));
    errors.collect(cdk.propertyValidator('afdSignaling', cdk.validateString)(properties.afdSignaling));
    errors.collect(cdk.propertyValidator('alternativeTransferFunction', cdk.validateString)(properties.alternativeTransferFunction));
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('bufSize', cdk.validateNumber)(properties.bufSize));
    errors.collect(cdk.propertyValidator('colorMetadata', cdk.validateString)(properties.colorMetadata));
    errors.collect(cdk.propertyValidator('colorSpaceSettings', CfnChannel_H265ColorSpaceSettingsPropertyValidator)(properties.colorSpaceSettings));
    errors.collect(cdk.propertyValidator('filterSettings', CfnChannel_H265FilterSettingsPropertyValidator)(properties.filterSettings));
    errors.collect(cdk.propertyValidator('fixedAfd', cdk.validateString)(properties.fixedAfd));
    errors.collect(cdk.propertyValidator('flickerAq', cdk.validateString)(properties.flickerAq));
    errors.collect(cdk.propertyValidator('framerateDenominator', cdk.validateNumber)(properties.framerateDenominator));
    errors.collect(cdk.propertyValidator('framerateNumerator', cdk.validateNumber)(properties.framerateNumerator));
    errors.collect(cdk.propertyValidator('gopClosedCadence', cdk.validateNumber)(properties.gopClosedCadence));
    errors.collect(cdk.propertyValidator('gopSize', cdk.validateNumber)(properties.gopSize));
    errors.collect(cdk.propertyValidator('gopSizeUnits', cdk.validateString)(properties.gopSizeUnits));
    errors.collect(cdk.propertyValidator('level', cdk.validateString)(properties.level));
    errors.collect(cdk.propertyValidator('lookAheadRateControl', cdk.validateString)(properties.lookAheadRateControl));
    errors.collect(cdk.propertyValidator('maxBitrate', cdk.validateNumber)(properties.maxBitrate));
    errors.collect(cdk.propertyValidator('minIInterval', cdk.validateNumber)(properties.minIInterval));
    errors.collect(cdk.propertyValidator('parDenominator', cdk.validateNumber)(properties.parDenominator));
    errors.collect(cdk.propertyValidator('parNumerator', cdk.validateNumber)(properties.parNumerator));
    errors.collect(cdk.propertyValidator('profile', cdk.validateString)(properties.profile));
    errors.collect(cdk.propertyValidator('qvbrQualityLevel', cdk.validateNumber)(properties.qvbrQualityLevel));
    errors.collect(cdk.propertyValidator('rateControlMode', cdk.validateString)(properties.rateControlMode));
    errors.collect(cdk.propertyValidator('scanType', cdk.validateString)(properties.scanType));
    errors.collect(cdk.propertyValidator('sceneChangeDetect', cdk.validateString)(properties.sceneChangeDetect));
    errors.collect(cdk.propertyValidator('slices', cdk.validateNumber)(properties.slices));
    errors.collect(cdk.propertyValidator('tier', cdk.validateString)(properties.tier));
    errors.collect(cdk.propertyValidator('timecodeInsertion', cdk.validateString)(properties.timecodeInsertion));
    return errors.wrap('supplied properties not correct for "H265SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265Settings` resource
 *
 * @param properties - the TypeScript properties of a `H265SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.H265Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelH265SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_H265SettingsPropertyValidator(properties).assertSuccess();
    return {
        AdaptiveQuantization: cdk.stringToCloudFormation(properties.adaptiveQuantization),
        AfdSignaling: cdk.stringToCloudFormation(properties.afdSignaling),
        AlternativeTransferFunction: cdk.stringToCloudFormation(properties.alternativeTransferFunction),
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        BufSize: cdk.numberToCloudFormation(properties.bufSize),
        ColorMetadata: cdk.stringToCloudFormation(properties.colorMetadata),
        ColorSpaceSettings: cfnChannelH265ColorSpaceSettingsPropertyToCloudFormation(properties.colorSpaceSettings),
        FilterSettings: cfnChannelH265FilterSettingsPropertyToCloudFormation(properties.filterSettings),
        FixedAfd: cdk.stringToCloudFormation(properties.fixedAfd),
        FlickerAq: cdk.stringToCloudFormation(properties.flickerAq),
        FramerateDenominator: cdk.numberToCloudFormation(properties.framerateDenominator),
        FramerateNumerator: cdk.numberToCloudFormation(properties.framerateNumerator),
        GopClosedCadence: cdk.numberToCloudFormation(properties.gopClosedCadence),
        GopSize: cdk.numberToCloudFormation(properties.gopSize),
        GopSizeUnits: cdk.stringToCloudFormation(properties.gopSizeUnits),
        Level: cdk.stringToCloudFormation(properties.level),
        LookAheadRateControl: cdk.stringToCloudFormation(properties.lookAheadRateControl),
        MaxBitrate: cdk.numberToCloudFormation(properties.maxBitrate),
        MinIInterval: cdk.numberToCloudFormation(properties.minIInterval),
        ParDenominator: cdk.numberToCloudFormation(properties.parDenominator),
        ParNumerator: cdk.numberToCloudFormation(properties.parNumerator),
        Profile: cdk.stringToCloudFormation(properties.profile),
        QvbrQualityLevel: cdk.numberToCloudFormation(properties.qvbrQualityLevel),
        RateControlMode: cdk.stringToCloudFormation(properties.rateControlMode),
        ScanType: cdk.stringToCloudFormation(properties.scanType),
        SceneChangeDetect: cdk.stringToCloudFormation(properties.sceneChangeDetect),
        Slices: cdk.numberToCloudFormation(properties.slices),
        Tier: cdk.stringToCloudFormation(properties.tier),
        TimecodeInsertion: cdk.stringToCloudFormation(properties.timecodeInsertion),
    };
}

// @ts-ignore TS6133
function CfnChannelH265SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.H265SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.H265SettingsProperty>();
    ret.addPropertyResult('adaptiveQuantization', 'AdaptiveQuantization', properties.AdaptiveQuantization != null ? cfn_parse.FromCloudFormation.getString(properties.AdaptiveQuantization) : undefined);
    ret.addPropertyResult('afdSignaling', 'AfdSignaling', properties.AfdSignaling != null ? cfn_parse.FromCloudFormation.getString(properties.AfdSignaling) : undefined);
    ret.addPropertyResult('alternativeTransferFunction', 'AlternativeTransferFunction', properties.AlternativeTransferFunction != null ? cfn_parse.FromCloudFormation.getString(properties.AlternativeTransferFunction) : undefined);
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('bufSize', 'BufSize', properties.BufSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BufSize) : undefined);
    ret.addPropertyResult('colorMetadata', 'ColorMetadata', properties.ColorMetadata != null ? cfn_parse.FromCloudFormation.getString(properties.ColorMetadata) : undefined);
    ret.addPropertyResult('colorSpaceSettings', 'ColorSpaceSettings', properties.ColorSpaceSettings != null ? CfnChannelH265ColorSpaceSettingsPropertyFromCloudFormation(properties.ColorSpaceSettings) : undefined);
    ret.addPropertyResult('filterSettings', 'FilterSettings', properties.FilterSettings != null ? CfnChannelH265FilterSettingsPropertyFromCloudFormation(properties.FilterSettings) : undefined);
    ret.addPropertyResult('fixedAfd', 'FixedAfd', properties.FixedAfd != null ? cfn_parse.FromCloudFormation.getString(properties.FixedAfd) : undefined);
    ret.addPropertyResult('flickerAq', 'FlickerAq', properties.FlickerAq != null ? cfn_parse.FromCloudFormation.getString(properties.FlickerAq) : undefined);
    ret.addPropertyResult('framerateDenominator', 'FramerateDenominator', properties.FramerateDenominator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateDenominator) : undefined);
    ret.addPropertyResult('framerateNumerator', 'FramerateNumerator', properties.FramerateNumerator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateNumerator) : undefined);
    ret.addPropertyResult('gopClosedCadence', 'GopClosedCadence', properties.GopClosedCadence != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopClosedCadence) : undefined);
    ret.addPropertyResult('gopSize', 'GopSize', properties.GopSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopSize) : undefined);
    ret.addPropertyResult('gopSizeUnits', 'GopSizeUnits', properties.GopSizeUnits != null ? cfn_parse.FromCloudFormation.getString(properties.GopSizeUnits) : undefined);
    ret.addPropertyResult('level', 'Level', properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined);
    ret.addPropertyResult('lookAheadRateControl', 'LookAheadRateControl', properties.LookAheadRateControl != null ? cfn_parse.FromCloudFormation.getString(properties.LookAheadRateControl) : undefined);
    ret.addPropertyResult('maxBitrate', 'MaxBitrate', properties.MaxBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBitrate) : undefined);
    ret.addPropertyResult('minIInterval', 'MinIInterval', properties.MinIInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinIInterval) : undefined);
    ret.addPropertyResult('parDenominator', 'ParDenominator', properties.ParDenominator != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParDenominator) : undefined);
    ret.addPropertyResult('parNumerator', 'ParNumerator', properties.ParNumerator != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParNumerator) : undefined);
    ret.addPropertyResult('profile', 'Profile', properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined);
    ret.addPropertyResult('qvbrQualityLevel', 'QvbrQualityLevel', properties.QvbrQualityLevel != null ? cfn_parse.FromCloudFormation.getNumber(properties.QvbrQualityLevel) : undefined);
    ret.addPropertyResult('rateControlMode', 'RateControlMode', properties.RateControlMode != null ? cfn_parse.FromCloudFormation.getString(properties.RateControlMode) : undefined);
    ret.addPropertyResult('scanType', 'ScanType', properties.ScanType != null ? cfn_parse.FromCloudFormation.getString(properties.ScanType) : undefined);
    ret.addPropertyResult('sceneChangeDetect', 'SceneChangeDetect', properties.SceneChangeDetect != null ? cfn_parse.FromCloudFormation.getString(properties.SceneChangeDetect) : undefined);
    ret.addPropertyResult('slices', 'Slices', properties.Slices != null ? cfn_parse.FromCloudFormation.getNumber(properties.Slices) : undefined);
    ret.addPropertyResult('tier', 'Tier', properties.Tier != null ? cfn_parse.FromCloudFormation.getString(properties.Tier) : undefined);
    ret.addPropertyResult('timecodeInsertion', 'TimecodeInsertion', properties.TimecodeInsertion != null ? cfn_parse.FromCloudFormation.getString(properties.TimecodeInsertion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Hdr10 Settings
     *
     * The parents of this entity are H265ColorSpaceSettings (for color space settings in the output) and VideoSelectorColorSpaceSettings (for color space settings in the input).
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hdr10settings.html
     */
    export interface Hdr10SettingsProperty {
        /**
         * Maximum Content Light Level
         * An integer metadata value defining the maximum light level, in nits,
         * of any single pixel within an encoded HDR video stream or file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hdr10settings.html#cfn-medialive-channel-hdr10settings-maxcll
         */
        readonly maxCll?: number;
        /**
         * Maximum Frame Average Light Level
         * An integer metadata value defining the maximum average light level, in nits,
         * for any single frame within an encoded HDR video stream or file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hdr10settings.html#cfn-medialive-channel-hdr10settings-maxfall
         */
        readonly maxFall?: number;
    }
}

/**
 * Determine whether the given properties match those of a `Hdr10SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Hdr10SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Hdr10SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxCll', cdk.validateNumber)(properties.maxCll));
    errors.collect(cdk.propertyValidator('maxFall', cdk.validateNumber)(properties.maxFall));
    return errors.wrap('supplied properties not correct for "Hdr10SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Hdr10Settings` resource
 *
 * @param properties - the TypeScript properties of a `Hdr10SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Hdr10Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHdr10SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Hdr10SettingsPropertyValidator(properties).assertSuccess();
    return {
        MaxCll: cdk.numberToCloudFormation(properties.maxCll),
        MaxFall: cdk.numberToCloudFormation(properties.maxFall),
    };
}

// @ts-ignore TS6133
function CfnChannelHdr10SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Hdr10SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Hdr10SettingsProperty>();
    ret.addPropertyResult('maxCll', 'MaxCll', properties.MaxCll != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCll) : undefined);
    ret.addPropertyResult('maxFall', 'MaxFall', properties.MaxFall != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFall) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The Akamai settings in an HLS output.
     *
     * The parent of this entity is HlsCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html
     */
    export interface HlsAkamaiSettingsProperty {
        /**
         * The number of seconds to wait before retrying a connection to the CDN if the connection is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The size, in seconds, of the file cache for streaming outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-filecacheduration
         */
        readonly filecacheDuration?: number;
        /**
         * Specifies whether to use chunked transfer encoding to Akamai. To enable this feature, contact Akamai.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-httptransfermode
         */
        readonly httpTransferMode?: string;
        /**
         * The number of retry attempts that will be made before the channel is put into an error state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-numretries
         */
        readonly numRetries?: number;
        /**
         * If a streaming output fails, the number of seconds to wait until a restart is initiated. A value of 0 means never restart.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-restartdelay
         */
        readonly restartDelay?: number;
        /**
         * The salt for authenticated Akamai.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-salt
         */
        readonly salt?: string;
        /**
         * The token parameter for authenticated Akamai. If this is not specified, _gda_ is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsakamaisettings.html#cfn-medialive-channel-hlsakamaisettings-token
         */
        readonly token?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsAkamaiSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsAkamaiSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsAkamaiSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('filecacheDuration', cdk.validateNumber)(properties.filecacheDuration));
    errors.collect(cdk.propertyValidator('httpTransferMode', cdk.validateString)(properties.httpTransferMode));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    errors.collect(cdk.propertyValidator('salt', cdk.validateString)(properties.salt));
    errors.collect(cdk.propertyValidator('token', cdk.validateString)(properties.token));
    return errors.wrap('supplied properties not correct for "HlsAkamaiSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsAkamaiSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsAkamaiSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsAkamaiSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsAkamaiSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsAkamaiSettingsPropertyValidator(properties).assertSuccess();
    return {
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        FilecacheDuration: cdk.numberToCloudFormation(properties.filecacheDuration),
        HttpTransferMode: cdk.stringToCloudFormation(properties.httpTransferMode),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
        Salt: cdk.stringToCloudFormation(properties.salt),
        Token: cdk.stringToCloudFormation(properties.token),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsAkamaiSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsAkamaiSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsAkamaiSettingsProperty>();
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('filecacheDuration', 'FilecacheDuration', properties.FilecacheDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilecacheDuration) : undefined);
    ret.addPropertyResult('httpTransferMode', 'HttpTransferMode', properties.HttpTransferMode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpTransferMode) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addPropertyResult('salt', 'Salt', properties.Salt != null ? cfn_parse.FromCloudFormation.getString(properties.Salt) : undefined);
    ret.addPropertyResult('token', 'Token', properties.Token != null ? cfn_parse.FromCloudFormation.getString(properties.Token) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of HLS Basic Put Settings.
     *
     * The parent of this entity is HlsCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsbasicputsettings.html
     */
    export interface HlsBasicPutSettingsProperty {
        /**
         * The number of seconds to wait before retrying a connection to the CDN if the connection is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsbasicputsettings.html#cfn-medialive-channel-hlsbasicputsettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The size, in seconds, of the file cache for streaming outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsbasicputsettings.html#cfn-medialive-channel-hlsbasicputsettings-filecacheduration
         */
        readonly filecacheDuration?: number;
        /**
         * The number of retry attempts that MediaLive makes before the channel is put into an error state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsbasicputsettings.html#cfn-medialive-channel-hlsbasicputsettings-numretries
         */
        readonly numRetries?: number;
        /**
         * If a streaming output fails, the number of seconds to wait until a restart is initiated. A value of 0 means never restart.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsbasicputsettings.html#cfn-medialive-channel-hlsbasicputsettings-restartdelay
         */
        readonly restartDelay?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HlsBasicPutSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsBasicPutSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsBasicPutSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('filecacheDuration', cdk.validateNumber)(properties.filecacheDuration));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    return errors.wrap('supplied properties not correct for "HlsBasicPutSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsBasicPutSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsBasicPutSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsBasicPutSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsBasicPutSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsBasicPutSettingsPropertyValidator(properties).assertSuccess();
    return {
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        FilecacheDuration: cdk.numberToCloudFormation(properties.filecacheDuration),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsBasicPutSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsBasicPutSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsBasicPutSettingsProperty>();
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('filecacheDuration', 'FilecacheDuration', properties.FilecacheDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilecacheDuration) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the CDN of an HLS output.
     *
     * The parent of this entity is HlsGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html
     */
    export interface HlsCdnSettingsProperty {
        /**
         * Sets up Akamai as the downstream system for the HLS output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html#cfn-medialive-channel-hlscdnsettings-hlsakamaisettings
         */
        readonly hlsAkamaiSettings?: CfnChannel.HlsAkamaiSettingsProperty | cdk.IResolvable;
        /**
         * The settings for Basic Put for the HLS output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html#cfn-medialive-channel-hlscdnsettings-hlsbasicputsettings
         */
        readonly hlsBasicPutSettings?: CfnChannel.HlsBasicPutSettingsProperty | cdk.IResolvable;
        /**
         * Sets up MediaStore as the destination for the HLS output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html#cfn-medialive-channel-hlscdnsettings-hlsmediastoresettings
         */
        readonly hlsMediaStoreSettings?: CfnChannel.HlsMediaStoreSettingsProperty | cdk.IResolvable;
        /**
         * Sets up Amazon S3 as the destination for this HLS output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html#cfn-medialive-channel-hlscdnsettings-hlss3settings
         */
        readonly hlsS3Settings?: CfnChannel.HlsS3SettingsProperty | cdk.IResolvable;
        /**
         * The settings for Web VTT captions in the HLS output group.
         *
         * The parent of this entity is HlsGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlscdnsettings.html#cfn-medialive-channel-hlscdnsettings-hlswebdavsettings
         */
        readonly hlsWebdavSettings?: CfnChannel.HlsWebdavSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsCdnSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsCdnSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsCdnSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hlsAkamaiSettings', CfnChannel_HlsAkamaiSettingsPropertyValidator)(properties.hlsAkamaiSettings));
    errors.collect(cdk.propertyValidator('hlsBasicPutSettings', CfnChannel_HlsBasicPutSettingsPropertyValidator)(properties.hlsBasicPutSettings));
    errors.collect(cdk.propertyValidator('hlsMediaStoreSettings', CfnChannel_HlsMediaStoreSettingsPropertyValidator)(properties.hlsMediaStoreSettings));
    errors.collect(cdk.propertyValidator('hlsS3Settings', CfnChannel_HlsS3SettingsPropertyValidator)(properties.hlsS3Settings));
    errors.collect(cdk.propertyValidator('hlsWebdavSettings', CfnChannel_HlsWebdavSettingsPropertyValidator)(properties.hlsWebdavSettings));
    return errors.wrap('supplied properties not correct for "HlsCdnSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsCdnSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsCdnSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsCdnSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsCdnSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsCdnSettingsPropertyValidator(properties).assertSuccess();
    return {
        HlsAkamaiSettings: cfnChannelHlsAkamaiSettingsPropertyToCloudFormation(properties.hlsAkamaiSettings),
        HlsBasicPutSettings: cfnChannelHlsBasicPutSettingsPropertyToCloudFormation(properties.hlsBasicPutSettings),
        HlsMediaStoreSettings: cfnChannelHlsMediaStoreSettingsPropertyToCloudFormation(properties.hlsMediaStoreSettings),
        HlsS3Settings: cfnChannelHlsS3SettingsPropertyToCloudFormation(properties.hlsS3Settings),
        HlsWebdavSettings: cfnChannelHlsWebdavSettingsPropertyToCloudFormation(properties.hlsWebdavSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsCdnSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsCdnSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsCdnSettingsProperty>();
    ret.addPropertyResult('hlsAkamaiSettings', 'HlsAkamaiSettings', properties.HlsAkamaiSettings != null ? CfnChannelHlsAkamaiSettingsPropertyFromCloudFormation(properties.HlsAkamaiSettings) : undefined);
    ret.addPropertyResult('hlsBasicPutSettings', 'HlsBasicPutSettings', properties.HlsBasicPutSettings != null ? CfnChannelHlsBasicPutSettingsPropertyFromCloudFormation(properties.HlsBasicPutSettings) : undefined);
    ret.addPropertyResult('hlsMediaStoreSettings', 'HlsMediaStoreSettings', properties.HlsMediaStoreSettings != null ? CfnChannelHlsMediaStoreSettingsPropertyFromCloudFormation(properties.HlsMediaStoreSettings) : undefined);
    ret.addPropertyResult('hlsS3Settings', 'HlsS3Settings', properties.HlsS3Settings != null ? CfnChannelHlsS3SettingsPropertyFromCloudFormation(properties.HlsS3Settings) : undefined);
    ret.addPropertyResult('hlsWebdavSettings', 'HlsWebdavSettings', properties.HlsWebdavSettings != null ? CfnChannelHlsWebdavSettingsPropertyFromCloudFormation(properties.HlsWebdavSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an HLS output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html
     */
    export interface HlsGroupSettingsProperty {
        /**
         * Chooses one or more ad marker types to pass SCTE35 signals through to this group of Apple HLS outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-admarkers
         */
        readonly adMarkers?: string[];
        /**
         * A partial URI prefix that will be prepended to each output in the media .m3u8 file. The partial URI prefix can be used if the base manifest is delivered from a different URL than the main .m3u8 file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-baseurlcontent
         */
        readonly baseUrlContent?: string;
        /**
         * Optional. One value per output group. This field is required only if you are completing Base URL content A, and the downstream system has notified you that the media files for pipeline 1 of all outputs are in a location different from the media files for pipeline 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-baseurlcontent1
         */
        readonly baseUrlContent1?: string;
        /**
         * A partial URI prefix that will be prepended to each output in the media .m3u8 file. The partial URI prefix can be used if the base manifest is delivered from a different URL than the main .m3u8 file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-baseurlmanifest
         */
        readonly baseUrlManifest?: string;
        /**
         * Optional. One value per output group. Complete this field only if you are completing Base URL manifest A, and the downstream system has notified you that the child manifest files for pipeline 1 of all outputs are in a location different from the child manifest files for pipeline 0.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-baseurlmanifest1
         */
        readonly baseUrlManifest1?: string;
        /**
         * A mapping of up to 4 captions channels to captions languages. This is meaningful only if captionLanguageSetting is set to "insert."
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-captionlanguagemappings
         */
        readonly captionLanguageMappings?: Array<CfnChannel.CaptionLanguageMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Applies only to 608 embedded output captions. Insert: Include CLOSED-CAPTIONS lines in the manifest. Specify at least one language in the CC1 Language Code field. One CLOSED-CAPTION line is added for each Language Code that you specify. Make sure to specify the languages in the order in which they appear in the original source (if the source is embedded format) or the order of the captions selectors (if the source is other than embedded). Otherwise, languages in the manifest will not match properly with the output captions. None: Include the CLOSED-CAPTIONS=NONE line in the manifest. Omit: Omit any CLOSED-CAPTIONS line from the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-captionlanguagesetting
         */
        readonly captionLanguageSetting?: string;
        /**
         * When set to "disabled," sets the #EXT-X-ALLOW-CACHE:no tag in the manifest, which prevents clients from saving media segments for later replay.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-clientcache
         */
        readonly clientCache?: string;
        /**
         * The specification to use (RFC-6381 or the default RFC-4281) during m3u8 playlist generation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-codecspecification
         */
        readonly codecSpecification?: string;
        /**
         * Used with encryptionType. This is a 128-bit, 16-byte hex value that is represented by a 32-character text string. If ivSource is set to "explicit," this parameter is required and is used as the IV for encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-constantiv
         */
        readonly constantIv?: string;
        /**
         * A directory or HTTP destination for the HLS segments, manifest files, and encryption keys (if enabled).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * Places segments in subdirectories.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-directorystructure
         */
        readonly directoryStructure?: string;
        /**
         * Specifies whether to insert EXT-X-DISCONTINUITY tags in the HLS child manifests for this output group.
         * Typically, choose Insert because these tags are required in the manifest (according to the HLS specification) and serve an important purpose.
         * Choose Never Insert only if the downstream system is doing real-time failover (without using the MediaLive automatic failover feature) and only if that downstream system has advised you to exclude the tags.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-discontinuitytags
         */
        readonly discontinuityTags?: string;
        /**
         * Encrypts the segments with the specified encryption scheme. Exclude this parameter if you don't want encryption.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-encryptiontype
         */
        readonly encryptionType?: string;
        /**
         * The parameters that control interactions with the CDN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-hlscdnsettings
         */
        readonly hlsCdnSettings?: CfnChannel.HlsCdnSettingsProperty | cdk.IResolvable;
        /**
         * State of HLS ID3 Segment Tagging
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-hlsid3segmenttagging
         */
        readonly hlsId3SegmentTagging?: string;
        /**
         * DISABLED: Don't create an I-frame-only manifest, but do create the master and media manifests (according to the Output Selection field). STANDARD: Create an I-frame-only manifest for each output that contains video, as well as the other manifests (according to the Output Selection field). The I-frame manifest contains a #EXT-X-I-FRAMES-ONLY tag to indicate it is I-frame only, and one or more #EXT-X-BYTERANGE entries identifying the I-frame position. For example, #EXT-X-BYTERANGE:160364@1461888".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-iframeonlyplaylists
         */
        readonly iFrameOnlyPlaylists?: string;
        /**
         * Specifies whether to include the final (incomplete) segment in the media output when the pipeline stops producing output because of a channel stop, a channel pause or a loss of input to the pipeline.
         * Auto means that MediaLive decides whether to include the final segment, depending on the channel class and the types of output groups.
         * Suppress means to never include the incomplete segment. We recommend you choose Auto and let MediaLive control the behavior.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-incompletesegmentbehavior
         */
        readonly incompleteSegmentBehavior?: string;
        /**
         * Applies only if the Mode field is LIVE. Specifies the maximum number of segments in the media manifest file. After this maximum, older segments are removed from the media manifest. This number must be less than or equal to the Keep Segments field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-indexnsegments
         */
        readonly indexNSegments?: number;
        /**
         * A parameter that controls output group behavior on an input loss.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-inputlossaction
         */
        readonly inputLossAction?: string;
        /**
         * Used with encryptionType. The IV (initialization vector) is a 128-bit number used in conjunction with the key for encrypting blocks. If set to "include," the IV is listed in the manifest. Otherwise, the IV is not in the manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-ivinmanifest
         */
        readonly ivInManifest?: string;
        /**
         * Used with encryptionType. The IV (initialization vector) is a 128-bit number used in conjunction with the key for encrypting blocks. If this setting is "followsSegmentNumber," it causes the IV to change every segment (to match the segment number). If this is set to "explicit," you must enter a constantIv value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-ivsource
         */
        readonly ivSource?: string;
        /**
         * Applies only if the Mode field is LIVE. Specifies the number of media segments (.ts files) to retain in the destination directory.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-keepsegments
         */
        readonly keepSegments?: number;
        /**
         * Specifies how the key is represented in the resource identified by the URI. If the parameter is absent, an implicit value of "identity" is used. A reverse DNS string can also be specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-keyformat
         */
        readonly keyFormat?: string;
        /**
         * Either a single positive integer version value or a slash-delimited list of version values (1/2/3).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-keyformatversions
         */
        readonly keyFormatVersions?: string;
        /**
         * The key provider settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-keyprovidersettings
         */
        readonly keyProviderSettings?: CfnChannel.KeyProviderSettingsProperty | cdk.IResolvable;
        /**
         * When set to gzip, compresses HLS playlist.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-manifestcompression
         */
        readonly manifestCompression?: string;
        /**
         * Indicates whether the output manifest should use a floating point or integer values for segment duration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-manifestdurationformat
         */
        readonly manifestDurationFormat?: string;
        /**
         * When set, minimumSegmentLength is enforced by looking ahead and back within the specified range for a nearby avail and extending the segment size if needed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-minsegmentlength
         */
        readonly minSegmentLength?: number;
        /**
         * If "vod," all segments are indexed and kept permanently in the destination and manifest. If "live," only the number segments specified in keepSegments and indexNSegments are kept. Newer segments replace older segments, which might prevent players from rewinding all the way to the beginning of the channel. VOD mode uses HLS EXT-X-PLAYLIST-TYPE of EVENT while the channel is running, converting it to a "VOD" type manifest on completion of the stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-mode
         */
        readonly mode?: string;
        /**
         * MANIFESTSANDSEGMENTS: Generates manifests (the master manifest, if applicable, and media manifests) for this output group. SEGMENTSONLY: Doesn't generate any manifests for this output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-outputselection
         */
        readonly outputSelection?: string;
        /**
         * Includes or excludes the EXT-X-PROGRAM-DATE-TIME tag in .m3u8 manifest files. The value is calculated as follows: Either the program date and time are initialized using the input timecode source, or the time is initialized using the input timecode source and the date is initialized using the timestampOffset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-programdatetime
         */
        readonly programDateTime?: string;
        /**
         * Specifies the algorithm used to drive the HLS EXT-X-PROGRAM-DATE-TIME clock. Options include: INITIALIZE_FROM_OUTPUT_TIMECODE: The PDT clock is initialized as a function of the first output timecode, then incremented by the EXTINF duration of each encoded segment. SYSTEM_CLOCK: The PDT clock is initialized as a function of the UTC wall clock, then incremented by the EXTINF duration of each encoded segment. If the PDT clock diverges from the wall clock by more than 500ms, it is resynchronized to the wall clock.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-programdatetimeclock
         */
        readonly programDateTimeClock?: string;
        /**
         * The period of insertion of the EXT-X-PROGRAM-DATE-TIME entry, in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-programdatetimeperiod
         */
        readonly programDateTimePeriod?: number;
        /**
         * ENABLED: The master manifest (.m3u8 file) for each pipeline includes information about both pipelines: first its own media files, then the media files of the other pipeline. This feature allows a playout device that supports stale manifest detection to switch from one manifest to the other, when the current manifest seems to be stale. There are still two destinations and two master manifests, but both master manifests reference the media files from both pipelines. DISABLED: The master manifest (.m3u8 file) for each pipeline includes information about its own pipeline only. For an HLS output group with MediaPackage as the destination, the DISABLED behavior is always followed. MediaPackage regenerates the manifests it serves to players, so a redundant manifest from MediaLive is irrelevant.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-redundantmanifest
         */
        readonly redundantManifest?: string;
        /**
         * The length of the MPEG-2 Transport Stream segments to create, in seconds. Note that segments will end on the next keyframe after this number of seconds, so the actual segment length might be longer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-segmentlength
         */
        readonly segmentLength?: number;
        /**
         * useInputSegmentation has been deprecated. The configured segment size is always used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-segmentationmode
         */
        readonly segmentationMode?: string;
        /**
         * The number of segments to write to a subdirectory before starting a new one. For this setting to have an effect, directoryStructure must be subdirectoryPerStream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-segmentspersubdirectory
         */
        readonly segmentsPerSubdirectory?: number;
        /**
         * The include or exclude RESOLUTION attribute for a video in the EXT-X-STREAM-INF tag of a variant manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-streaminfresolution
         */
        readonly streamInfResolution?: string;
        /**
         * Indicates the ID3 frame that has the timecode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-timedmetadataid3frame
         */
        readonly timedMetadataId3Frame?: string;
        /**
         * The timed metadata interval, in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-timedmetadataid3period
         */
        readonly timedMetadataId3Period?: number;
        /**
         * Provides an extra millisecond delta offset to fine tune the timestamps.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-timestampdeltamilliseconds
         */
        readonly timestampDeltaMilliseconds?: number;
        /**
         * SEGMENTEDFILES: Emits the program as segments -multiple .ts media files. SINGLEFILE: Applies only if the Mode field is VOD. Emits the program as a single .ts media file. The media manifest includes #EXT-X-BYTERANGE tags to index segments for playback. A typical use for this value is when sending the output to AWS Elemental MediaConvert, which can accept only a single media file. Playback while the channel is running is not guaranteed due to HTTP server caching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsgroupsettings.html#cfn-medialive-channel-hlsgroupsettings-tsfilemode
         */
        readonly tsFileMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkers', cdk.listValidator(cdk.validateString))(properties.adMarkers));
    errors.collect(cdk.propertyValidator('baseUrlContent', cdk.validateString)(properties.baseUrlContent));
    errors.collect(cdk.propertyValidator('baseUrlContent1', cdk.validateString)(properties.baseUrlContent1));
    errors.collect(cdk.propertyValidator('baseUrlManifest', cdk.validateString)(properties.baseUrlManifest));
    errors.collect(cdk.propertyValidator('baseUrlManifest1', cdk.validateString)(properties.baseUrlManifest1));
    errors.collect(cdk.propertyValidator('captionLanguageMappings', cdk.listValidator(CfnChannel_CaptionLanguageMappingPropertyValidator))(properties.captionLanguageMappings));
    errors.collect(cdk.propertyValidator('captionLanguageSetting', cdk.validateString)(properties.captionLanguageSetting));
    errors.collect(cdk.propertyValidator('clientCache', cdk.validateString)(properties.clientCache));
    errors.collect(cdk.propertyValidator('codecSpecification', cdk.validateString)(properties.codecSpecification));
    errors.collect(cdk.propertyValidator('constantIv', cdk.validateString)(properties.constantIv));
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('directoryStructure', cdk.validateString)(properties.directoryStructure));
    errors.collect(cdk.propertyValidator('discontinuityTags', cdk.validateString)(properties.discontinuityTags));
    errors.collect(cdk.propertyValidator('encryptionType', cdk.validateString)(properties.encryptionType));
    errors.collect(cdk.propertyValidator('hlsCdnSettings', CfnChannel_HlsCdnSettingsPropertyValidator)(properties.hlsCdnSettings));
    errors.collect(cdk.propertyValidator('hlsId3SegmentTagging', cdk.validateString)(properties.hlsId3SegmentTagging));
    errors.collect(cdk.propertyValidator('iFrameOnlyPlaylists', cdk.validateString)(properties.iFrameOnlyPlaylists));
    errors.collect(cdk.propertyValidator('incompleteSegmentBehavior', cdk.validateString)(properties.incompleteSegmentBehavior));
    errors.collect(cdk.propertyValidator('indexNSegments', cdk.validateNumber)(properties.indexNSegments));
    errors.collect(cdk.propertyValidator('inputLossAction', cdk.validateString)(properties.inputLossAction));
    errors.collect(cdk.propertyValidator('ivInManifest', cdk.validateString)(properties.ivInManifest));
    errors.collect(cdk.propertyValidator('ivSource', cdk.validateString)(properties.ivSource));
    errors.collect(cdk.propertyValidator('keepSegments', cdk.validateNumber)(properties.keepSegments));
    errors.collect(cdk.propertyValidator('keyFormat', cdk.validateString)(properties.keyFormat));
    errors.collect(cdk.propertyValidator('keyFormatVersions', cdk.validateString)(properties.keyFormatVersions));
    errors.collect(cdk.propertyValidator('keyProviderSettings', CfnChannel_KeyProviderSettingsPropertyValidator)(properties.keyProviderSettings));
    errors.collect(cdk.propertyValidator('manifestCompression', cdk.validateString)(properties.manifestCompression));
    errors.collect(cdk.propertyValidator('manifestDurationFormat', cdk.validateString)(properties.manifestDurationFormat));
    errors.collect(cdk.propertyValidator('minSegmentLength', cdk.validateNumber)(properties.minSegmentLength));
    errors.collect(cdk.propertyValidator('mode', cdk.validateString)(properties.mode));
    errors.collect(cdk.propertyValidator('outputSelection', cdk.validateString)(properties.outputSelection));
    errors.collect(cdk.propertyValidator('programDateTime', cdk.validateString)(properties.programDateTime));
    errors.collect(cdk.propertyValidator('programDateTimeClock', cdk.validateString)(properties.programDateTimeClock));
    errors.collect(cdk.propertyValidator('programDateTimePeriod', cdk.validateNumber)(properties.programDateTimePeriod));
    errors.collect(cdk.propertyValidator('redundantManifest', cdk.validateString)(properties.redundantManifest));
    errors.collect(cdk.propertyValidator('segmentLength', cdk.validateNumber)(properties.segmentLength));
    errors.collect(cdk.propertyValidator('segmentationMode', cdk.validateString)(properties.segmentationMode));
    errors.collect(cdk.propertyValidator('segmentsPerSubdirectory', cdk.validateNumber)(properties.segmentsPerSubdirectory));
    errors.collect(cdk.propertyValidator('streamInfResolution', cdk.validateString)(properties.streamInfResolution));
    errors.collect(cdk.propertyValidator('timedMetadataId3Frame', cdk.validateString)(properties.timedMetadataId3Frame));
    errors.collect(cdk.propertyValidator('timedMetadataId3Period', cdk.validateNumber)(properties.timedMetadataId3Period));
    errors.collect(cdk.propertyValidator('timestampDeltaMilliseconds', cdk.validateNumber)(properties.timestampDeltaMilliseconds));
    errors.collect(cdk.propertyValidator('tsFileMode', cdk.validateString)(properties.tsFileMode));
    return errors.wrap('supplied properties not correct for "HlsGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        AdMarkers: cdk.listMapper(cdk.stringToCloudFormation)(properties.adMarkers),
        BaseUrlContent: cdk.stringToCloudFormation(properties.baseUrlContent),
        BaseUrlContent1: cdk.stringToCloudFormation(properties.baseUrlContent1),
        BaseUrlManifest: cdk.stringToCloudFormation(properties.baseUrlManifest),
        BaseUrlManifest1: cdk.stringToCloudFormation(properties.baseUrlManifest1),
        CaptionLanguageMappings: cdk.listMapper(cfnChannelCaptionLanguageMappingPropertyToCloudFormation)(properties.captionLanguageMappings),
        CaptionLanguageSetting: cdk.stringToCloudFormation(properties.captionLanguageSetting),
        ClientCache: cdk.stringToCloudFormation(properties.clientCache),
        CodecSpecification: cdk.stringToCloudFormation(properties.codecSpecification),
        ConstantIv: cdk.stringToCloudFormation(properties.constantIv),
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        DirectoryStructure: cdk.stringToCloudFormation(properties.directoryStructure),
        DiscontinuityTags: cdk.stringToCloudFormation(properties.discontinuityTags),
        EncryptionType: cdk.stringToCloudFormation(properties.encryptionType),
        HlsCdnSettings: cfnChannelHlsCdnSettingsPropertyToCloudFormation(properties.hlsCdnSettings),
        HlsId3SegmentTagging: cdk.stringToCloudFormation(properties.hlsId3SegmentTagging),
        IFrameOnlyPlaylists: cdk.stringToCloudFormation(properties.iFrameOnlyPlaylists),
        IncompleteSegmentBehavior: cdk.stringToCloudFormation(properties.incompleteSegmentBehavior),
        IndexNSegments: cdk.numberToCloudFormation(properties.indexNSegments),
        InputLossAction: cdk.stringToCloudFormation(properties.inputLossAction),
        IvInManifest: cdk.stringToCloudFormation(properties.ivInManifest),
        IvSource: cdk.stringToCloudFormation(properties.ivSource),
        KeepSegments: cdk.numberToCloudFormation(properties.keepSegments),
        KeyFormat: cdk.stringToCloudFormation(properties.keyFormat),
        KeyFormatVersions: cdk.stringToCloudFormation(properties.keyFormatVersions),
        KeyProviderSettings: cfnChannelKeyProviderSettingsPropertyToCloudFormation(properties.keyProviderSettings),
        ManifestCompression: cdk.stringToCloudFormation(properties.manifestCompression),
        ManifestDurationFormat: cdk.stringToCloudFormation(properties.manifestDurationFormat),
        MinSegmentLength: cdk.numberToCloudFormation(properties.minSegmentLength),
        Mode: cdk.stringToCloudFormation(properties.mode),
        OutputSelection: cdk.stringToCloudFormation(properties.outputSelection),
        ProgramDateTime: cdk.stringToCloudFormation(properties.programDateTime),
        ProgramDateTimeClock: cdk.stringToCloudFormation(properties.programDateTimeClock),
        ProgramDateTimePeriod: cdk.numberToCloudFormation(properties.programDateTimePeriod),
        RedundantManifest: cdk.stringToCloudFormation(properties.redundantManifest),
        SegmentLength: cdk.numberToCloudFormation(properties.segmentLength),
        SegmentationMode: cdk.stringToCloudFormation(properties.segmentationMode),
        SegmentsPerSubdirectory: cdk.numberToCloudFormation(properties.segmentsPerSubdirectory),
        StreamInfResolution: cdk.stringToCloudFormation(properties.streamInfResolution),
        TimedMetadataId3Frame: cdk.stringToCloudFormation(properties.timedMetadataId3Frame),
        TimedMetadataId3Period: cdk.numberToCloudFormation(properties.timedMetadataId3Period),
        TimestampDeltaMilliseconds: cdk.numberToCloudFormation(properties.timestampDeltaMilliseconds),
        TsFileMode: cdk.stringToCloudFormation(properties.tsFileMode),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsGroupSettingsProperty>();
    ret.addPropertyResult('adMarkers', 'AdMarkers', properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdMarkers) : undefined);
    ret.addPropertyResult('baseUrlContent', 'BaseUrlContent', properties.BaseUrlContent != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrlContent) : undefined);
    ret.addPropertyResult('baseUrlContent1', 'BaseUrlContent1', properties.BaseUrlContent1 != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrlContent1) : undefined);
    ret.addPropertyResult('baseUrlManifest', 'BaseUrlManifest', properties.BaseUrlManifest != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrlManifest) : undefined);
    ret.addPropertyResult('baseUrlManifest1', 'BaseUrlManifest1', properties.BaseUrlManifest1 != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrlManifest1) : undefined);
    ret.addPropertyResult('captionLanguageMappings', 'CaptionLanguageMappings', properties.CaptionLanguageMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelCaptionLanguageMappingPropertyFromCloudFormation)(properties.CaptionLanguageMappings) : undefined);
    ret.addPropertyResult('captionLanguageSetting', 'CaptionLanguageSetting', properties.CaptionLanguageSetting != null ? cfn_parse.FromCloudFormation.getString(properties.CaptionLanguageSetting) : undefined);
    ret.addPropertyResult('clientCache', 'ClientCache', properties.ClientCache != null ? cfn_parse.FromCloudFormation.getString(properties.ClientCache) : undefined);
    ret.addPropertyResult('codecSpecification', 'CodecSpecification', properties.CodecSpecification != null ? cfn_parse.FromCloudFormation.getString(properties.CodecSpecification) : undefined);
    ret.addPropertyResult('constantIv', 'ConstantIv', properties.ConstantIv != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantIv) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('directoryStructure', 'DirectoryStructure', properties.DirectoryStructure != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryStructure) : undefined);
    ret.addPropertyResult('discontinuityTags', 'DiscontinuityTags', properties.DiscontinuityTags != null ? cfn_parse.FromCloudFormation.getString(properties.DiscontinuityTags) : undefined);
    ret.addPropertyResult('encryptionType', 'EncryptionType', properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined);
    ret.addPropertyResult('hlsCdnSettings', 'HlsCdnSettings', properties.HlsCdnSettings != null ? CfnChannelHlsCdnSettingsPropertyFromCloudFormation(properties.HlsCdnSettings) : undefined);
    ret.addPropertyResult('hlsId3SegmentTagging', 'HlsId3SegmentTagging', properties.HlsId3SegmentTagging != null ? cfn_parse.FromCloudFormation.getString(properties.HlsId3SegmentTagging) : undefined);
    ret.addPropertyResult('iFrameOnlyPlaylists', 'IFrameOnlyPlaylists', properties.IFrameOnlyPlaylists != null ? cfn_parse.FromCloudFormation.getString(properties.IFrameOnlyPlaylists) : undefined);
    ret.addPropertyResult('incompleteSegmentBehavior', 'IncompleteSegmentBehavior', properties.IncompleteSegmentBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.IncompleteSegmentBehavior) : undefined);
    ret.addPropertyResult('indexNSegments', 'IndexNSegments', properties.IndexNSegments != null ? cfn_parse.FromCloudFormation.getNumber(properties.IndexNSegments) : undefined);
    ret.addPropertyResult('inputLossAction', 'InputLossAction', properties.InputLossAction != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossAction) : undefined);
    ret.addPropertyResult('ivInManifest', 'IvInManifest', properties.IvInManifest != null ? cfn_parse.FromCloudFormation.getString(properties.IvInManifest) : undefined);
    ret.addPropertyResult('ivSource', 'IvSource', properties.IvSource != null ? cfn_parse.FromCloudFormation.getString(properties.IvSource) : undefined);
    ret.addPropertyResult('keepSegments', 'KeepSegments', properties.KeepSegments != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeepSegments) : undefined);
    ret.addPropertyResult('keyFormat', 'KeyFormat', properties.KeyFormat != null ? cfn_parse.FromCloudFormation.getString(properties.KeyFormat) : undefined);
    ret.addPropertyResult('keyFormatVersions', 'KeyFormatVersions', properties.KeyFormatVersions != null ? cfn_parse.FromCloudFormation.getString(properties.KeyFormatVersions) : undefined);
    ret.addPropertyResult('keyProviderSettings', 'KeyProviderSettings', properties.KeyProviderSettings != null ? CfnChannelKeyProviderSettingsPropertyFromCloudFormation(properties.KeyProviderSettings) : undefined);
    ret.addPropertyResult('manifestCompression', 'ManifestCompression', properties.ManifestCompression != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestCompression) : undefined);
    ret.addPropertyResult('manifestDurationFormat', 'ManifestDurationFormat', properties.ManifestDurationFormat != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestDurationFormat) : undefined);
    ret.addPropertyResult('minSegmentLength', 'MinSegmentLength', properties.MinSegmentLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSegmentLength) : undefined);
    ret.addPropertyResult('mode', 'Mode', properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined);
    ret.addPropertyResult('outputSelection', 'OutputSelection', properties.OutputSelection != null ? cfn_parse.FromCloudFormation.getString(properties.OutputSelection) : undefined);
    ret.addPropertyResult('programDateTime', 'ProgramDateTime', properties.ProgramDateTime != null ? cfn_parse.FromCloudFormation.getString(properties.ProgramDateTime) : undefined);
    ret.addPropertyResult('programDateTimeClock', 'ProgramDateTimeClock', properties.ProgramDateTimeClock != null ? cfn_parse.FromCloudFormation.getString(properties.ProgramDateTimeClock) : undefined);
    ret.addPropertyResult('programDateTimePeriod', 'ProgramDateTimePeriod', properties.ProgramDateTimePeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimePeriod) : undefined);
    ret.addPropertyResult('redundantManifest', 'RedundantManifest', properties.RedundantManifest != null ? cfn_parse.FromCloudFormation.getString(properties.RedundantManifest) : undefined);
    ret.addPropertyResult('segmentLength', 'SegmentLength', properties.SegmentLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentLength) : undefined);
    ret.addPropertyResult('segmentationMode', 'SegmentationMode', properties.SegmentationMode != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentationMode) : undefined);
    ret.addPropertyResult('segmentsPerSubdirectory', 'SegmentsPerSubdirectory', properties.SegmentsPerSubdirectory != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentsPerSubdirectory) : undefined);
    ret.addPropertyResult('streamInfResolution', 'StreamInfResolution', properties.StreamInfResolution != null ? cfn_parse.FromCloudFormation.getString(properties.StreamInfResolution) : undefined);
    ret.addPropertyResult('timedMetadataId3Frame', 'TimedMetadataId3Frame', properties.TimedMetadataId3Frame != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataId3Frame) : undefined);
    ret.addPropertyResult('timedMetadataId3Period', 'TimedMetadataId3Period', properties.TimedMetadataId3Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimedMetadataId3Period) : undefined);
    ret.addPropertyResult('timestampDeltaMilliseconds', 'TimestampDeltaMilliseconds', properties.TimestampDeltaMilliseconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimestampDeltaMilliseconds) : undefined);
    ret.addPropertyResult('tsFileMode', 'TsFileMode', properties.TsFileMode != null ? cfn_parse.FromCloudFormation.getString(properties.TsFileMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about how to connect to the upstream system.
     *
     * The parent of this entity is NetworkInputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html
     */
    export interface HlsInputSettingsProperty {
        /**
         * When specified, the HLS stream with the m3u8 bandwidth that most closely matches this value is chosen. Otherwise, the highest bandwidth stream in the m3u8 is chosen. The bitrate is specified in bits per second, as in an HLS manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html#cfn-medialive-channel-hlsinputsettings-bandwidth
         */
        readonly bandwidth?: number;
        /**
         * When specified, reading of the HLS input begins this many buffer segments from the end (most recently written segment). When not specified, the HLS input begins with the first segment specified in the m3u8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html#cfn-medialive-channel-hlsinputsettings-buffersegments
         */
        readonly bufferSegments?: number;
        /**
         * The number of consecutive times that attempts to read a manifest or segment must fail before the input is considered unavailable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html#cfn-medialive-channel-hlsinputsettings-retries
         */
        readonly retries?: number;
        /**
         * The number of seconds between retries when an attempt to read a manifest or segment fails.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html#cfn-medialive-channel-hlsinputsettings-retryinterval
         */
        readonly retryInterval?: number;
        /**
         * Identifies the source for the SCTE-35 messages that MediaLive will ingest. Messages can be ingested from the content segments (in the stream) or from tags in the playlist (the HLS manifest). MediaLive ignores SCTE-35 information in the source that is not selected.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsinputsettings.html#cfn-medialive-channel-hlsinputsettings-scte35source
         */
        readonly scte35Source?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsInputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsInputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsInputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bandwidth', cdk.validateNumber)(properties.bandwidth));
    errors.collect(cdk.propertyValidator('bufferSegments', cdk.validateNumber)(properties.bufferSegments));
    errors.collect(cdk.propertyValidator('retries', cdk.validateNumber)(properties.retries));
    errors.collect(cdk.propertyValidator('retryInterval', cdk.validateNumber)(properties.retryInterval));
    errors.collect(cdk.propertyValidator('scte35Source', cdk.validateString)(properties.scte35Source));
    return errors.wrap('supplied properties not correct for "HlsInputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsInputSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsInputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsInputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsInputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsInputSettingsPropertyValidator(properties).assertSuccess();
    return {
        Bandwidth: cdk.numberToCloudFormation(properties.bandwidth),
        BufferSegments: cdk.numberToCloudFormation(properties.bufferSegments),
        Retries: cdk.numberToCloudFormation(properties.retries),
        RetryInterval: cdk.numberToCloudFormation(properties.retryInterval),
        Scte35Source: cdk.stringToCloudFormation(properties.scte35Source),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsInputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsInputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsInputSettingsProperty>();
    ret.addPropertyResult('bandwidth', 'Bandwidth', properties.Bandwidth != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bandwidth) : undefined);
    ret.addPropertyResult('bufferSegments', 'BufferSegments', properties.BufferSegments != null ? cfn_parse.FromCloudFormation.getNumber(properties.BufferSegments) : undefined);
    ret.addPropertyResult('retries', 'Retries', properties.Retries != null ? cfn_parse.FromCloudFormation.getNumber(properties.Retries) : undefined);
    ret.addPropertyResult('retryInterval', 'RetryInterval', properties.RetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetryInterval) : undefined);
    ret.addPropertyResult('scte35Source', 'Scte35Source', properties.Scte35Source != null ? cfn_parse.FromCloudFormation.getString(properties.Scte35Source) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of a MediaStore container as the destination for an HLS output.
     *
     * The parent of this entity is HlsCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html
     */
    export interface HlsMediaStoreSettingsProperty {
        /**
         * The number of seconds to wait before retrying a connection to the CDN if the connection is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html#cfn-medialive-channel-hlsmediastoresettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The size, in seconds, of the file cache for streaming outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html#cfn-medialive-channel-hlsmediastoresettings-filecacheduration
         */
        readonly filecacheDuration?: number;
        /**
         * When set to temporal, output files are stored in non-persistent memory for faster reading and writing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html#cfn-medialive-channel-hlsmediastoresettings-mediastorestorageclass
         */
        readonly mediaStoreStorageClass?: string;
        /**
         * The number of retry attempts that are made before the channel is put into an error state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html#cfn-medialive-channel-hlsmediastoresettings-numretries
         */
        readonly numRetries?: number;
        /**
         * If a streaming output fails, the number of seconds to wait until a restart is initiated. A value of 0 means never restart.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsmediastoresettings.html#cfn-medialive-channel-hlsmediastoresettings-restartdelay
         */
        readonly restartDelay?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HlsMediaStoreSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsMediaStoreSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsMediaStoreSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('filecacheDuration', cdk.validateNumber)(properties.filecacheDuration));
    errors.collect(cdk.propertyValidator('mediaStoreStorageClass', cdk.validateString)(properties.mediaStoreStorageClass));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    return errors.wrap('supplied properties not correct for "HlsMediaStoreSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsMediaStoreSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsMediaStoreSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsMediaStoreSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsMediaStoreSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsMediaStoreSettingsPropertyValidator(properties).assertSuccess();
    return {
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        FilecacheDuration: cdk.numberToCloudFormation(properties.filecacheDuration),
        MediaStoreStorageClass: cdk.stringToCloudFormation(properties.mediaStoreStorageClass),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsMediaStoreSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsMediaStoreSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsMediaStoreSettingsProperty>();
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('filecacheDuration', 'FilecacheDuration', properties.FilecacheDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilecacheDuration) : undefined);
    ret.addPropertyResult('mediaStoreStorageClass', 'MediaStoreStorageClass', properties.MediaStoreStorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.MediaStoreStorageClass) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an HLS output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsoutputsettings.html
     */
    export interface HlsOutputSettingsProperty {
        /**
         * Only applicable when this output is referencing an H.265 video description.
         * Specifies whether MP4 segments should be packaged as HEV1 or HVC1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsoutputsettings.html#cfn-medialive-channel-hlsoutputsettings-h265packagingtype
         */
        readonly h265PackagingType?: string;
        /**
         * The settings regarding the underlying stream. These settings are different for audio-only outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsoutputsettings.html#cfn-medialive-channel-hlsoutputsettings-hlssettings
         */
        readonly hlsSettings?: CfnChannel.HlsSettingsProperty | cdk.IResolvable;
        /**
         * A string that is concatenated to the end of the destination file name. Accepts \"Format Identifiers\":#formatIdentifierParameters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsoutputsettings.html#cfn-medialive-channel-hlsoutputsettings-namemodifier
         */
        readonly nameModifier?: string;
        /**
         * A string that is concatenated to the end of segment file names.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlsoutputsettings.html#cfn-medialive-channel-hlsoutputsettings-segmentmodifier
         */
        readonly segmentModifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('h265PackagingType', cdk.validateString)(properties.h265PackagingType));
    errors.collect(cdk.propertyValidator('hlsSettings', CfnChannel_HlsSettingsPropertyValidator)(properties.hlsSettings));
    errors.collect(cdk.propertyValidator('nameModifier', cdk.validateString)(properties.nameModifier));
    errors.collect(cdk.propertyValidator('segmentModifier', cdk.validateString)(properties.segmentModifier));
    return errors.wrap('supplied properties not correct for "HlsOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        H265PackagingType: cdk.stringToCloudFormation(properties.h265PackagingType),
        HlsSettings: cfnChannelHlsSettingsPropertyToCloudFormation(properties.hlsSettings),
        NameModifier: cdk.stringToCloudFormation(properties.nameModifier),
        SegmentModifier: cdk.stringToCloudFormation(properties.segmentModifier),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsOutputSettingsProperty>();
    ret.addPropertyResult('h265PackagingType', 'H265PackagingType', properties.H265PackagingType != null ? cfn_parse.FromCloudFormation.getString(properties.H265PackagingType) : undefined);
    ret.addPropertyResult('hlsSettings', 'HlsSettings', properties.HlsSettings != null ? CfnChannelHlsSettingsPropertyFromCloudFormation(properties.HlsSettings) : undefined);
    ret.addPropertyResult('nameModifier', 'NameModifier', properties.NameModifier != null ? cfn_parse.FromCloudFormation.getString(properties.NameModifier) : undefined);
    ret.addPropertyResult('segmentModifier', 'SegmentModifier', properties.SegmentModifier != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentModifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Sets up Amazon S3 as the destination for this HLS output.
     *
     * The parent of this entity is HlsCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlss3settings.html
     */
    export interface HlsS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlss3settings.html#cfn-medialive-channel-hlss3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `HlsS3SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsS3SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsS3SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cannedAcl', cdk.validateString)(properties.cannedAcl));
    return errors.wrap('supplied properties not correct for "HlsS3SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsS3Settings` resource
 *
 * @param properties - the TypeScript properties of a `HlsS3SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsS3Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsS3SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsS3SettingsPropertyValidator(properties).assertSuccess();
    return {
        CannedAcl: cdk.stringToCloudFormation(properties.cannedAcl),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsS3SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsS3SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsS3SettingsProperty>();
    ret.addPropertyResult('cannedAcl', 'CannedAcl', properties.CannedAcl != null ? cfn_parse.FromCloudFormation.getString(properties.CannedAcl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for an HLS output.
     *
     * The parent of this entity is HlsOutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlssettings.html
     */
    export interface HlsSettingsProperty {
        /**
         * The settings for an audio-only output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlssettings.html#cfn-medialive-channel-hlssettings-audioonlyhlssettings
         */
        readonly audioOnlyHlsSettings?: CfnChannel.AudioOnlyHlsSettingsProperty | cdk.IResolvable;
        /**
         * The settings for an fMP4 container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlssettings.html#cfn-medialive-channel-hlssettings-fmp4hlssettings
         */
        readonly fmp4HlsSettings?: CfnChannel.Fmp4HlsSettingsProperty | cdk.IResolvable;
        /**
         * Settings for a frame capture output in an HLS output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlssettings.html#cfn-medialive-channel-hlssettings-framecapturehlssettings
         */
        readonly frameCaptureHlsSettings?: CfnChannel.FrameCaptureHlsSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a standard output (an output that is not audio-only).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlssettings.html#cfn-medialive-channel-hlssettings-standardhlssettings
         */
        readonly standardHlsSettings?: CfnChannel.StandardHlsSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `HlsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioOnlyHlsSettings', CfnChannel_AudioOnlyHlsSettingsPropertyValidator)(properties.audioOnlyHlsSettings));
    errors.collect(cdk.propertyValidator('fmp4HlsSettings', CfnChannel_Fmp4HlsSettingsPropertyValidator)(properties.fmp4HlsSettings));
    errors.collect(cdk.propertyValidator('frameCaptureHlsSettings', CfnChannel_FrameCaptureHlsSettingsPropertyValidator)(properties.frameCaptureHlsSettings));
    errors.collect(cdk.propertyValidator('standardHlsSettings', CfnChannel_StandardHlsSettingsPropertyValidator)(properties.standardHlsSettings));
    return errors.wrap('supplied properties not correct for "HlsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioOnlyHlsSettings: cfnChannelAudioOnlyHlsSettingsPropertyToCloudFormation(properties.audioOnlyHlsSettings),
        Fmp4HlsSettings: cfnChannelFmp4HlsSettingsPropertyToCloudFormation(properties.fmp4HlsSettings),
        FrameCaptureHlsSettings: cfnChannelFrameCaptureHlsSettingsPropertyToCloudFormation(properties.frameCaptureHlsSettings),
        StandardHlsSettings: cfnChannelStandardHlsSettingsPropertyToCloudFormation(properties.standardHlsSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsSettingsProperty>();
    ret.addPropertyResult('audioOnlyHlsSettings', 'AudioOnlyHlsSettings', properties.AudioOnlyHlsSettings != null ? CfnChannelAudioOnlyHlsSettingsPropertyFromCloudFormation(properties.AudioOnlyHlsSettings) : undefined);
    ret.addPropertyResult('fmp4HlsSettings', 'Fmp4HlsSettings', properties.Fmp4HlsSettings != null ? CfnChannelFmp4HlsSettingsPropertyFromCloudFormation(properties.Fmp4HlsSettings) : undefined);
    ret.addPropertyResult('frameCaptureHlsSettings', 'FrameCaptureHlsSettings', properties.FrameCaptureHlsSettings != null ? CfnChannelFrameCaptureHlsSettingsPropertyFromCloudFormation(properties.FrameCaptureHlsSettings) : undefined);
    ret.addPropertyResult('standardHlsSettings', 'StandardHlsSettings', properties.StandardHlsSettings != null ? CfnChannelStandardHlsSettingsPropertyFromCloudFormation(properties.StandardHlsSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of a WebDav server as the downstream system for an HLS output.
     *
     * The parent of this entity is HlsCdnSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html
     */
    export interface HlsWebdavSettingsProperty {
        /**
         * The number of seconds to wait before retrying a connection to the CDN if the connection is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html#cfn-medialive-channel-hlswebdavsettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The size, in seconds, of the file cache for streaming outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html#cfn-medialive-channel-hlswebdavsettings-filecacheduration
         */
        readonly filecacheDuration?: number;
        /**
         * Specifies whether to use chunked transfer encoding to WebDAV.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html#cfn-medialive-channel-hlswebdavsettings-httptransfermode
         */
        readonly httpTransferMode?: string;
        /**
         * The number of retry attempts that are made before the channel is put into an error state.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html#cfn-medialive-channel-hlswebdavsettings-numretries
         */
        readonly numRetries?: number;
        /**
         * If a streaming output fails, the number of seconds to wait until a restart is initiated. A value of 0 means never restart.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlswebdavsettings.html#cfn-medialive-channel-hlswebdavsettings-restartdelay
         */
        readonly restartDelay?: number;
    }
}

/**
 * Determine whether the given properties match those of a `HlsWebdavSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsWebdavSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HlsWebdavSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('filecacheDuration', cdk.validateNumber)(properties.filecacheDuration));
    errors.collect(cdk.propertyValidator('httpTransferMode', cdk.validateString)(properties.httpTransferMode));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    return errors.wrap('supplied properties not correct for "HlsWebdavSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsWebdavSettings` resource
 *
 * @param properties - the TypeScript properties of a `HlsWebdavSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HlsWebdavSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHlsWebdavSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HlsWebdavSettingsPropertyValidator(properties).assertSuccess();
    return {
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        FilecacheDuration: cdk.numberToCloudFormation(properties.filecacheDuration),
        HttpTransferMode: cdk.stringToCloudFormation(properties.httpTransferMode),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
    };
}

// @ts-ignore TS6133
function CfnChannelHlsWebdavSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsWebdavSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsWebdavSettingsProperty>();
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('filecacheDuration', 'FilecacheDuration', properties.FilecacheDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilecacheDuration) : undefined);
    ret.addPropertyResult('httpTransferMode', 'HttpTransferMode', properties.HttpTransferMode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpTransferMode) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure the motion graphics overlay to use an HTML asset.
     *
     * The parent of this entity is MotionGraphicsSetting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-htmlmotiongraphicssettings.html
     */
    export interface HtmlMotionGraphicsSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `HtmlMotionGraphicsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HtmlMotionGraphicsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_HtmlMotionGraphicsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "HtmlMotionGraphicsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HtmlMotionGraphicsSettings` resource
 *
 * @param properties - the TypeScript properties of a `HtmlMotionGraphicsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.HtmlMotionGraphicsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelHtmlMotionGraphicsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_HtmlMotionGraphicsSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelHtmlMotionGraphicsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HtmlMotionGraphicsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HtmlMotionGraphicsSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * An input to attach to this channel.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputattachment.html
     */
    export interface InputAttachmentProperty {
        /**
         * Settings to implement automatic input failover in this input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputattachment.html#cfn-medialive-channel-inputattachment-automaticinputfailoversettings
         */
        readonly automaticInputFailoverSettings?: CfnChannel.AutomaticInputFailoverSettingsProperty | cdk.IResolvable;
        /**
         * A name for the attachment. This is required if you want to use this input in an input switch action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputattachment.html#cfn-medialive-channel-inputattachment-inputattachmentname
         */
        readonly inputAttachmentName?: string;
        /**
         * The ID of the input to attach.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputattachment.html#cfn-medialive-channel-inputattachment-inputid
         */
        readonly inputId?: string;
        /**
         * Information about the content to extract from the input and about the general handling of the content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputattachment.html#cfn-medialive-channel-inputattachment-inputsettings
         */
        readonly inputSettings?: CfnChannel.InputSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputAttachmentProperty`
 *
 * @param properties - the TypeScript properties of a `InputAttachmentProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputAttachmentPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('automaticInputFailoverSettings', CfnChannel_AutomaticInputFailoverSettingsPropertyValidator)(properties.automaticInputFailoverSettings));
    errors.collect(cdk.propertyValidator('inputAttachmentName', cdk.validateString)(properties.inputAttachmentName));
    errors.collect(cdk.propertyValidator('inputId', cdk.validateString)(properties.inputId));
    errors.collect(cdk.propertyValidator('inputSettings', CfnChannel_InputSettingsPropertyValidator)(properties.inputSettings));
    return errors.wrap('supplied properties not correct for "InputAttachmentProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputAttachment` resource
 *
 * @param properties - the TypeScript properties of a `InputAttachmentProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputAttachment` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputAttachmentPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputAttachmentPropertyValidator(properties).assertSuccess();
    return {
        AutomaticInputFailoverSettings: cfnChannelAutomaticInputFailoverSettingsPropertyToCloudFormation(properties.automaticInputFailoverSettings),
        InputAttachmentName: cdk.stringToCloudFormation(properties.inputAttachmentName),
        InputId: cdk.stringToCloudFormation(properties.inputId),
        InputSettings: cfnChannelInputSettingsPropertyToCloudFormation(properties.inputSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelInputAttachmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputAttachmentProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputAttachmentProperty>();
    ret.addPropertyResult('automaticInputFailoverSettings', 'AutomaticInputFailoverSettings', properties.AutomaticInputFailoverSettings != null ? CfnChannelAutomaticInputFailoverSettingsPropertyFromCloudFormation(properties.AutomaticInputFailoverSettings) : undefined);
    ret.addPropertyResult('inputAttachmentName', 'InputAttachmentName', properties.InputAttachmentName != null ? cfn_parse.FromCloudFormation.getString(properties.InputAttachmentName) : undefined);
    ret.addPropertyResult('inputId', 'InputId', properties.InputId != null ? cfn_parse.FromCloudFormation.getString(properties.InputId) : undefined);
    ret.addPropertyResult('inputSettings', 'InputSettings', properties.InputSettings != null ? CfnChannelInputSettingsPropertyFromCloudFormation(properties.InputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setting to remix the audio.
     *
     * The parent of this entity is AudioChannelMappings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputchannellevel.html
     */
    export interface InputChannelLevelProperty {
        /**
         * The remixing value. Units are in dB, and acceptable values are within the range from -60 (mute) to 6 dB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputchannellevel.html#cfn-medialive-channel-inputchannellevel-gain
         */
        readonly gain?: number;
        /**
         * The index of the input channel that is used as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputchannellevel.html#cfn-medialive-channel-inputchannellevel-inputchannel
         */
        readonly inputChannel?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InputChannelLevelProperty`
 *
 * @param properties - the TypeScript properties of a `InputChannelLevelProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputChannelLevelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('gain', cdk.validateNumber)(properties.gain));
    errors.collect(cdk.propertyValidator('inputChannel', cdk.validateNumber)(properties.inputChannel));
    return errors.wrap('supplied properties not correct for "InputChannelLevelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputChannelLevel` resource
 *
 * @param properties - the TypeScript properties of a `InputChannelLevelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputChannelLevel` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputChannelLevelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputChannelLevelPropertyValidator(properties).assertSuccess();
    return {
        Gain: cdk.numberToCloudFormation(properties.gain),
        InputChannel: cdk.numberToCloudFormation(properties.inputChannel),
    };
}

// @ts-ignore TS6133
function CfnChannelInputChannelLevelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputChannelLevelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputChannelLevelProperty>();
    ret.addPropertyResult('gain', 'Gain', properties.Gain != null ? cfn_parse.FromCloudFormation.getNumber(properties.Gain) : undefined);
    ret.addPropertyResult('inputChannel', 'InputChannel', properties.InputChannel != null ? cfn_parse.FromCloudFormation.getNumber(properties.InputChannel) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The input location.
     *
     * The parent of this entity is InputLossBehavior.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlocation.html
     */
    export interface InputLocationProperty {
        /**
         * The password parameter that holds the password for accessing the downstream system. This applies only if the downstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlocation.html#cfn-medialive-channel-inputlocation-passwordparam
         */
        readonly passwordParam?: string;
        /**
         * The URI should be a path to a file that is accessible to the Live system (for example, an http:// URI) depending on the output type. For example, an RTMP destination should have a URI similar to rtmp://fmsserver/live.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlocation.html#cfn-medialive-channel-inputlocation-uri
         */
        readonly uri?: string;
        /**
         * The user name to connect to the downstream system. This applies only if the downstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlocation.html#cfn-medialive-channel-inputlocation-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `InputLocationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputLocationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('passwordParam', cdk.validateString)(properties.passwordParam));
    errors.collect(cdk.propertyValidator('uri', cdk.validateString)(properties.uri));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "InputLocationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLocation` resource
 *
 * @param properties - the TypeScript properties of a `InputLocationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLocation` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputLocationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputLocationPropertyValidator(properties).assertSuccess();
    return {
        PasswordParam: cdk.stringToCloudFormation(properties.passwordParam),
        Uri: cdk.stringToCloudFormation(properties.uri),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnChannelInputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputLocationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputLocationProperty>();
    ret.addPropertyResult('passwordParam', 'PasswordParam', properties.PasswordParam != null ? cfn_parse.FromCloudFormation.getString(properties.PasswordParam) : undefined);
    ret.addPropertyResult('uri', 'Uri', properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of channel behavior when the input is lost.
     *
     * The parent of this entity is GlobalConfiguration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html
     */
    export interface InputLossBehaviorProperty {
        /**
         * On input loss, the number of milliseconds to substitute black into the output before switching to the frame specified by inputLossImageType. A value x, where 0 <= x <= 1,000,000 and a value of 1,000,000, is interpreted as infinite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html#cfn-medialive-channel-inputlossbehavior-blackframemsec
         */
        readonly blackFrameMsec?: number;
        /**
         * When the input loss image type is "color," this field specifies the color to use. Value: 6 hex characters that represent the values of RGB.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html#cfn-medialive-channel-inputlossbehavior-inputlossimagecolor
         */
        readonly inputLossImageColor?: string;
        /**
         * When the input loss image type is "slate," these fields specify the parameters for accessing the slate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html#cfn-medialive-channel-inputlossbehavior-inputlossimageslate
         */
        readonly inputLossImageSlate?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * Indicates whether to substitute a solid color or a slate into the output after the input loss exceeds blackFrameMsec.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html#cfn-medialive-channel-inputlossbehavior-inputlossimagetype
         */
        readonly inputLossImageType?: string;
        /**
         * On input loss, the number of milliseconds to repeat the previous picture before substituting black into the output. A value x, where 0 <= x <= 1,000,000 and a value of 1,000,000, is interpreted as infinite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossbehavior.html#cfn-medialive-channel-inputlossbehavior-repeatframemsec
         */
        readonly repeatFrameMsec?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InputLossBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `InputLossBehaviorProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputLossBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blackFrameMsec', cdk.validateNumber)(properties.blackFrameMsec));
    errors.collect(cdk.propertyValidator('inputLossImageColor', cdk.validateString)(properties.inputLossImageColor));
    errors.collect(cdk.propertyValidator('inputLossImageSlate', CfnChannel_InputLocationPropertyValidator)(properties.inputLossImageSlate));
    errors.collect(cdk.propertyValidator('inputLossImageType', cdk.validateString)(properties.inputLossImageType));
    errors.collect(cdk.propertyValidator('repeatFrameMsec', cdk.validateNumber)(properties.repeatFrameMsec));
    return errors.wrap('supplied properties not correct for "InputLossBehaviorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLossBehavior` resource
 *
 * @param properties - the TypeScript properties of a `InputLossBehaviorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLossBehavior` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputLossBehaviorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputLossBehaviorPropertyValidator(properties).assertSuccess();
    return {
        BlackFrameMsec: cdk.numberToCloudFormation(properties.blackFrameMsec),
        InputLossImageColor: cdk.stringToCloudFormation(properties.inputLossImageColor),
        InputLossImageSlate: cfnChannelInputLocationPropertyToCloudFormation(properties.inputLossImageSlate),
        InputLossImageType: cdk.stringToCloudFormation(properties.inputLossImageType),
        RepeatFrameMsec: cdk.numberToCloudFormation(properties.repeatFrameMsec),
    };
}

// @ts-ignore TS6133
function CfnChannelInputLossBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputLossBehaviorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputLossBehaviorProperty>();
    ret.addPropertyResult('blackFrameMsec', 'BlackFrameMsec', properties.BlackFrameMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlackFrameMsec) : undefined);
    ret.addPropertyResult('inputLossImageColor', 'InputLossImageColor', properties.InputLossImageColor != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossImageColor) : undefined);
    ret.addPropertyResult('inputLossImageSlate', 'InputLossImageSlate', properties.InputLossImageSlate != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.InputLossImageSlate) : undefined);
    ret.addPropertyResult('inputLossImageType', 'InputLossImageType', properties.InputLossImageType != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossImageType) : undefined);
    ret.addPropertyResult('repeatFrameMsec', 'RepeatFrameMsec', properties.RepeatFrameMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.RepeatFrameMsec) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * MediaLive will perform a failover if content is not detected in this input for the specified period.
     *
     * The parent of this entity is FailoverConditionSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossfailoversettings.html
     */
    export interface InputLossFailoverSettingsProperty {
        /**
         * The amount of time (in milliseconds) that no input is detected. After that time, an input failover will occur.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossfailoversettings.html#cfn-medialive-channel-inputlossfailoversettings-inputlossthresholdmsec
         */
        readonly inputLossThresholdMsec?: number;
    }
}

/**
 * Determine whether the given properties match those of a `InputLossFailoverSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `InputLossFailoverSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputLossFailoverSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputLossThresholdMsec', cdk.validateNumber)(properties.inputLossThresholdMsec));
    return errors.wrap('supplied properties not correct for "InputLossFailoverSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLossFailoverSettings` resource
 *
 * @param properties - the TypeScript properties of a `InputLossFailoverSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputLossFailoverSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputLossFailoverSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputLossFailoverSettingsPropertyValidator(properties).assertSuccess();
    return {
        InputLossThresholdMsec: cdk.numberToCloudFormation(properties.inputLossThresholdMsec),
    };
}

// @ts-ignore TS6133
function CfnChannelInputLossFailoverSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputLossFailoverSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputLossFailoverSettingsProperty>();
    ret.addPropertyResult('inputLossThresholdMsec', 'InputLossThresholdMsec', properties.InputLossThresholdMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.InputLossThresholdMsec) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about extracting content from the input and about handling the content.
     *
     * The parent of this entity is InputAttachment.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html
     */
    export interface InputSettingsProperty {
        /**
         * Information about the specific audio to extract from the input.
         *
         * The parent of this entity is InputSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-audioselectors
         */
        readonly audioSelectors?: Array<CfnChannel.AudioSelectorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Information about the specific captions to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-captionselectors
         */
        readonly captionSelectors?: Array<CfnChannel.CaptionSelectorProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Enables or disables the deblock filter when filtering.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-deblockfilter
         */
        readonly deblockFilter?: string;
        /**
         * Enables or disables the denoise filter when filtering.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-denoisefilter
         */
        readonly denoiseFilter?: string;
        /**
         * Adjusts the magnitude of filtering from 1 (minimal) to 5 (strongest).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-filterstrength
         */
        readonly filterStrength?: number;
        /**
         * Turns on the filter for this input. MPEG-2 inputs have the deblocking filter enabled by default. 1) auto - filtering is applied depending on input type/quality 2) disabled - no filtering is applied to the input 3) forced - filtering is applied regardless of the input type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-inputfilter
         */
        readonly inputFilter?: string;
        /**
         * Information about how to connect to the upstream system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-networkinputsettings
         */
        readonly networkInputSettings?: CfnChannel.NetworkInputSettingsProperty | cdk.IResolvable;
        /**
         * `CfnChannel.InputSettingsProperty.Scte35Pid`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-scte35pid
         */
        readonly scte35Pid?: number;
        /**
         * Specifies whether to extract applicable ancillary data from a SMPTE-2038 source in this input. Applicable data types are captions, timecode, AFD, and SCTE-104 messages.
         * - PREFER: Extract from SMPTE-2038 if present in this input, otherwise extract from another source (if any).
         * - IGNORE: Never extract any ancillary data from SMPTE-2038.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-smpte2038datapreference
         */
        readonly smpte2038DataPreference?: string;
        /**
         * The loop input if it is a file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-sourceendbehavior
         */
        readonly sourceEndBehavior?: string;
        /**
         * Information about one video to extract from the input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputsettings.html#cfn-medialive-channel-inputsettings-videoselector
         */
        readonly videoSelector?: CfnChannel.VideoSelectorProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `InputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `InputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioSelectors', cdk.listValidator(CfnChannel_AudioSelectorPropertyValidator))(properties.audioSelectors));
    errors.collect(cdk.propertyValidator('captionSelectors', cdk.listValidator(CfnChannel_CaptionSelectorPropertyValidator))(properties.captionSelectors));
    errors.collect(cdk.propertyValidator('deblockFilter', cdk.validateString)(properties.deblockFilter));
    errors.collect(cdk.propertyValidator('denoiseFilter', cdk.validateString)(properties.denoiseFilter));
    errors.collect(cdk.propertyValidator('filterStrength', cdk.validateNumber)(properties.filterStrength));
    errors.collect(cdk.propertyValidator('inputFilter', cdk.validateString)(properties.inputFilter));
    errors.collect(cdk.propertyValidator('networkInputSettings', CfnChannel_NetworkInputSettingsPropertyValidator)(properties.networkInputSettings));
    errors.collect(cdk.propertyValidator('scte35Pid', cdk.validateNumber)(properties.scte35Pid));
    errors.collect(cdk.propertyValidator('smpte2038DataPreference', cdk.validateString)(properties.smpte2038DataPreference));
    errors.collect(cdk.propertyValidator('sourceEndBehavior', cdk.validateString)(properties.sourceEndBehavior));
    errors.collect(cdk.propertyValidator('videoSelector', CfnChannel_VideoSelectorPropertyValidator)(properties.videoSelector));
    return errors.wrap('supplied properties not correct for "InputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputSettings` resource
 *
 * @param properties - the TypeScript properties of a `InputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioSelectors: cdk.listMapper(cfnChannelAudioSelectorPropertyToCloudFormation)(properties.audioSelectors),
        CaptionSelectors: cdk.listMapper(cfnChannelCaptionSelectorPropertyToCloudFormation)(properties.captionSelectors),
        DeblockFilter: cdk.stringToCloudFormation(properties.deblockFilter),
        DenoiseFilter: cdk.stringToCloudFormation(properties.denoiseFilter),
        FilterStrength: cdk.numberToCloudFormation(properties.filterStrength),
        InputFilter: cdk.stringToCloudFormation(properties.inputFilter),
        NetworkInputSettings: cfnChannelNetworkInputSettingsPropertyToCloudFormation(properties.networkInputSettings),
        Scte35Pid: cdk.numberToCloudFormation(properties.scte35Pid),
        Smpte2038DataPreference: cdk.stringToCloudFormation(properties.smpte2038DataPreference),
        SourceEndBehavior: cdk.stringToCloudFormation(properties.sourceEndBehavior),
        VideoSelector: cfnChannelVideoSelectorPropertyToCloudFormation(properties.videoSelector),
    };
}

// @ts-ignore TS6133
function CfnChannelInputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputSettingsProperty>();
    ret.addPropertyResult('audioSelectors', 'AudioSelectors', properties.AudioSelectors != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelAudioSelectorPropertyFromCloudFormation)(properties.AudioSelectors) : undefined);
    ret.addPropertyResult('captionSelectors', 'CaptionSelectors', properties.CaptionSelectors != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelCaptionSelectorPropertyFromCloudFormation)(properties.CaptionSelectors) : undefined);
    ret.addPropertyResult('deblockFilter', 'DeblockFilter', properties.DeblockFilter != null ? cfn_parse.FromCloudFormation.getString(properties.DeblockFilter) : undefined);
    ret.addPropertyResult('denoiseFilter', 'DenoiseFilter', properties.DenoiseFilter != null ? cfn_parse.FromCloudFormation.getString(properties.DenoiseFilter) : undefined);
    ret.addPropertyResult('filterStrength', 'FilterStrength', properties.FilterStrength != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilterStrength) : undefined);
    ret.addPropertyResult('inputFilter', 'InputFilter', properties.InputFilter != null ? cfn_parse.FromCloudFormation.getString(properties.InputFilter) : undefined);
    ret.addPropertyResult('networkInputSettings', 'NetworkInputSettings', properties.NetworkInputSettings != null ? CfnChannelNetworkInputSettingsPropertyFromCloudFormation(properties.NetworkInputSettings) : undefined);
    ret.addPropertyResult('scte35Pid', 'Scte35Pid', properties.Scte35Pid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Scte35Pid) : undefined);
    ret.addPropertyResult('smpte2038DataPreference', 'Smpte2038DataPreference', properties.Smpte2038DataPreference != null ? cfn_parse.FromCloudFormation.getString(properties.Smpte2038DataPreference) : undefined);
    ret.addPropertyResult('sourceEndBehavior', 'SourceEndBehavior', properties.SourceEndBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.SourceEndBehavior) : undefined);
    ret.addPropertyResult('videoSelector', 'VideoSelector', properties.VideoSelector != null ? CfnChannelVideoSelectorPropertyFromCloudFormation(properties.VideoSelector) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The input specification for this channel. It specifies the key characteristics of the inputs for this channel: the maximum bitrate, the resolution, and the codec.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputspecification.html
     */
    export interface InputSpecificationProperty {
        /**
         * The codec to include in the input specification for this channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputspecification.html#cfn-medialive-channel-inputspecification-codec
         */
        readonly codec?: string;
        /**
         * The maximum input bitrate for any input attached to this channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputspecification.html#cfn-medialive-channel-inputspecification-maximumbitrate
         */
        readonly maximumBitrate?: string;
        /**
         * The resolution for any input attached to this channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputspecification.html#cfn-medialive-channel-inputspecification-resolution
         */
        readonly resolution?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `InputSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_InputSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codec', cdk.validateString)(properties.codec));
    errors.collect(cdk.propertyValidator('maximumBitrate', cdk.validateString)(properties.maximumBitrate));
    errors.collect(cdk.propertyValidator('resolution', cdk.validateString)(properties.resolution));
    return errors.wrap('supplied properties not correct for "InputSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputSpecification` resource
 *
 * @param properties - the TypeScript properties of a `InputSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.InputSpecification` resource.
 */
// @ts-ignore TS6133
function cfnChannelInputSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_InputSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Codec: cdk.stringToCloudFormation(properties.codec),
        MaximumBitrate: cdk.stringToCloudFormation(properties.maximumBitrate),
        Resolution: cdk.stringToCloudFormation(properties.resolution),
    };
}

// @ts-ignore TS6133
function CfnChannelInputSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.InputSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.InputSpecificationProperty>();
    ret.addPropertyResult('codec', 'Codec', properties.Codec != null ? cfn_parse.FromCloudFormation.getString(properties.Codec) : undefined);
    ret.addPropertyResult('maximumBitrate', 'MaximumBitrate', properties.MaximumBitrate != null ? cfn_parse.FromCloudFormation.getString(properties.MaximumBitrate) : undefined);
    ret.addPropertyResult('resolution', 'Resolution', properties.Resolution != null ? cfn_parse.FromCloudFormation.getString(properties.Resolution) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of key provider settings.
     *
     * The parent of this entity is HlsGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-keyprovidersettings.html
     */
    export interface KeyProviderSettingsProperty {
        /**
         * The configuration of static key settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-keyprovidersettings.html#cfn-medialive-channel-keyprovidersettings-statickeysettings
         */
        readonly staticKeySettings?: CfnChannel.StaticKeySettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `KeyProviderSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `KeyProviderSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_KeyProviderSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('staticKeySettings', CfnChannel_StaticKeySettingsPropertyValidator)(properties.staticKeySettings));
    return errors.wrap('supplied properties not correct for "KeyProviderSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.KeyProviderSettings` resource
 *
 * @param properties - the TypeScript properties of a `KeyProviderSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.KeyProviderSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelKeyProviderSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_KeyProviderSettingsPropertyValidator(properties).assertSuccess();
    return {
        StaticKeySettings: cfnChannelStaticKeySettingsPropertyToCloudFormation(properties.staticKeySettings),
    };
}

// @ts-ignore TS6133
function CfnChannelKeyProviderSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.KeyProviderSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.KeyProviderSettingsProperty>();
    ret.addPropertyResult('staticKeySettings', 'StaticKeySettings', properties.StaticKeySettings != null ? CfnChannelStaticKeySettingsPropertyFromCloudFormation(properties.StaticKeySettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of the M2TS in the output.
     *
     * The parents of this entity are ArchiveContainerSettings and UdpContainerSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html
     */
    export interface M2tsSettingsProperty {
        /**
         * When set to drop, the output audio streams are removed from the program if the selected input audio stream is removed from the input. This allows the output audio configuration to dynamically change based on the input configuration. If this is set to encodeSilence, all output audio streams will output encoded silence when not connected to an active input stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-absentinputaudiobehavior
         */
        readonly absentInputAudioBehavior?: string;
        /**
         * When set to enabled, uses ARIB-compliant field muxing and removes video descriptor.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-arib
         */
        readonly arib?: string;
        /**
         * The PID for ARIB Captions in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-aribcaptionspid
         */
        readonly aribCaptionsPid?: string;
        /**
         * If set to auto, The PID number used for ARIB Captions will be auto-selected from unused PIDs. If set to useConfigured, ARIB captions will be on the configured PID number.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-aribcaptionspidcontrol
         */
        readonly aribCaptionsPidControl?: string;
        /**
         * When set to dvb, uses the DVB buffer model for Dolby Digital audio. When set to atsc, the ATSC model is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-audiobuffermodel
         */
        readonly audioBufferModel?: string;
        /**
         * The number of audio frames to insert for each PES packet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-audioframesperpes
         */
        readonly audioFramesPerPes?: number;
        /**
         * The PID of the elementary audio streams in the transport stream. Multiple values are accepted, and can be entered in ranges or by comma separation. You can enter the value as a decimal or hexadecimal value. Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-audiopids
         */
        readonly audioPids?: string;
        /**
         * When set to atsc, uses stream type = 0x81 for AC3 and stream type = 0x87 for EAC3. When set to dvb, uses stream type = 0x06.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-audiostreamtype
         */
        readonly audioStreamType?: string;
        /**
         * The output bitrate of the transport stream in bits per second. Setting to 0 lets the muxer automatically determine the appropriate bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-bitrate
         */
        readonly bitrate?: number;
        /**
         * If set to multiplex, uses the multiplex buffer model for accurate interleaving. Setting to bufferModel to none can lead to lower latency, but low-memory devices might not be able to play back the stream without interruptions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-buffermodel
         */
        readonly bufferModel?: string;
        /**
         * When set to enabled, generates captionServiceDescriptor in PMT.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ccdescriptor
         */
        readonly ccDescriptor?: string;
        /**
         * Inserts a DVB Network Information Table (NIT) at the specified table repetition interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-dvbnitsettings
         */
        readonly dvbNitSettings?: CfnChannel.DvbNitSettingsProperty | cdk.IResolvable;
        /**
         * Inserts a DVB Service Description Table (SDT) at the specified table repetition interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-dvbsdtsettings
         */
        readonly dvbSdtSettings?: CfnChannel.DvbSdtSettingsProperty | cdk.IResolvable;
        /**
         * The PID for the input source DVB Subtitle data to this output. Multiple values are accepted, and can be entered in ranges and/or by comma separation. You can enter the value as a decimal or hexadecimal value. Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-dvbsubpids
         */
        readonly dvbSubPids?: string;
        /**
         * Inserts DVB Time and Date Table (TDT) at the specified table repetition interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-dvbtdtsettings
         */
        readonly dvbTdtSettings?: CfnChannel.DvbTdtSettingsProperty | cdk.IResolvable;
        /**
         * The PID for the input source DVB Teletext data to this output. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-dvbteletextpid
         */
        readonly dvbTeletextPid?: string;
        /**
         * If set to passthrough, passes any EBIF data from the input source to this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ebif
         */
        readonly ebif?: string;
        /**
         * When videoAndFixedIntervals is selected, audio EBP markers are added to partitions 3 and 4. The interval between these additional markers is fixed, and is slightly shorter than the video EBP marker interval. This is only available when EBP Cablelabs segmentation markers are selected. Partitions 1 and 2 always follow the video interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ebpaudiointerval
         */
        readonly ebpAudioInterval?: string;
        /**
         * When set, enforces that Encoder Boundary Points do not come within the specified time interval of each other by looking ahead at input video. If another EBP is going to come in within the specified time interval, the current EBP is not emitted, and the segment is "stretched" to the next marker. The lookahead value does not add latency to the system. The channel must be configured elsewhere to create sufficient latency to make the lookahead accurate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ebplookaheadms
         */
        readonly ebpLookaheadMs?: number;
        /**
         * Controls placement of EBP on audio PIDs. If set to videoAndAudioPids, EBP markers are placed on the video PID and all audio PIDs. If set to videoPid, EBP markers are placed on only the video PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ebpplacement
         */
        readonly ebpPlacement?: string;
        /**
         * This field is unused and deprecated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ecmpid
         */
        readonly ecmPid?: string;
        /**
         * Includes or excludes the ES Rate field in the PES header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-esrateinpes
         */
        readonly esRateInPes?: string;
        /**
         * The PID for the input source ETV Platform data to this output. You can enter it as a decimal or hexadecimal value. Valid values are 32 (or 0x20) to 8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-etvplatformpid
         */
        readonly etvPlatformPid?: string;
        /**
         * The PID for input source ETV Signal data to this output. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-etvsignalpid
         */
        readonly etvSignalPid?: string;
        /**
         * The length in seconds of each fragment. This is used only with EBP markers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-fragmenttime
         */
        readonly fragmentTime?: number;
        /**
         * If set to passthrough, passes any KLV data from the input source to this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-klv
         */
        readonly klv?: string;
        /**
         * The PID for the input source KLV data to this output. Multiple values are accepted, and can be entered in ranges or by comma separation. You can enter the value as a decimal or hexadecimal value. Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-klvdatapids
         */
        readonly klvDataPids?: string;
        /**
         * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-nielsenid3behavior
         */
        readonly nielsenId3Behavior?: string;
        /**
         * The value, in bits per second, of extra null packets to insert into the transport stream. This can be used if a downstream encryption system requires periodic null packets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-nullpacketbitrate
         */
        readonly nullPacketBitrate?: number;
        /**
         * The number of milliseconds between instances of this table in the output transport stream. Valid values are 0, 10..1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-patinterval
         */
        readonly patInterval?: number;
        /**
         * When set to pcrEveryPesPacket, a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This parameter is effective only when the PCR PID is the same as the video or audio elementary stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-pcrcontrol
         */
        readonly pcrControl?: string;
        /**
         * The maximum time, in milliseconds, between Program Clock References (PCRs) inserted into the transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-pcrperiod
         */
        readonly pcrPeriod?: number;
        /**
         * The PID of the Program Clock Reference (PCR) in the transport stream. When no value is given, MediaLive assigns the same value as the video PID. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-pcrpid
         */
        readonly pcrPid?: string;
        /**
         * The number of milliseconds between instances of this table in the output transport stream. Valid values are 0, 10..1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-pmtinterval
         */
        readonly pmtInterval?: number;
        /**
         * The PID for the Program Map Table (PMT) in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-pmtpid
         */
        readonly pmtPid?: string;
        /**
         * The value of the program number field in the Program Map Table (PMT).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-programnum
         */
        readonly programNum?: number;
        /**
         * When VBR, does not insert null packets into the transport stream to fill the specified bitrate. The bitrate setting acts as the maximum bitrate when VBR is set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-ratemode
         */
        readonly rateMode?: string;
        /**
         * The PID for the input source SCTE-27 data to this output. Multiple values are accepted, and can be entered in ranges or by comma separation. You can enter the value as a decimal or hexadecimal value. Each PID specified must be in the range of 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-scte27pids
         */
        readonly scte27Pids?: string;
        /**
         * Optionally passes SCTE-35 signals from the input source to this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-scte35control
         */
        readonly scte35Control?: string;
        /**
         * The PID of the SCTE-35 stream in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-scte35pid
         */
        readonly scte35Pid?: string;
        /**
         * Inserts segmentation markers at each segmentationTime period. raiSegstart sets the Random Access Indicator bit in the adaptation field. raiAdapt sets the RAI bit and adds the current timecode in the private data bytes. psiSegstart inserts PAT and PMT tables at the start of segments. ebp adds Encoder Boundary Point information to the adaptation field as per OpenCable specification OC-SP-EBP-I01-130118. ebpLegacy adds Encoder Boundary Point information to the adaptation field using a legacy proprietary format.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-segmentationmarkers
         */
        readonly segmentationMarkers?: string;
        /**
         * The segmentation style parameter controls how segmentation markers are inserted into the transport stream. With avails, it is possible that segments might be truncated, which can influence where future segmentation markers are inserted. When a segmentation style of resetCadence is selected and a segment is truncated due to an avail, we will reset the segmentation cadence. This means the subsequent segment will have a duration of $segmentationTime seconds. When a segmentation style of maintainCadence is selected and a segment is truncated due to an avail, we will not reset the segmentation cadence. This means the subsequent segment will likely be truncated as well. However, all segments after that will have a duration of $segmentationTime seconds. Note that EBP lookahead is a slight exception to this rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-segmentationstyle
         */
        readonly segmentationStyle?: string;
        /**
         * The length, in seconds, of each segment. This is required unless markers is set to None_.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-segmentationtime
         */
        readonly segmentationTime?: number;
        /**
         * When set to passthrough, timed metadata is passed through from input to output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-timedmetadatabehavior
         */
        readonly timedMetadataBehavior?: string;
        /**
         * The PID of the timed metadata stream in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-timedmetadatapid
         */
        readonly timedMetadataPid?: string;
        /**
         * The value of the transport stream ID field in the Program Map Table (PMT).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-transportstreamid
         */
        readonly transportStreamId?: number;
        /**
         * The PID of the elementary video stream in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m2tssettings.html#cfn-medialive-channel-m2tssettings-videopid
         */
        readonly videoPid?: string;
    }
}

/**
 * Determine whether the given properties match those of a `M2tsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `M2tsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_M2tsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('absentInputAudioBehavior', cdk.validateString)(properties.absentInputAudioBehavior));
    errors.collect(cdk.propertyValidator('arib', cdk.validateString)(properties.arib));
    errors.collect(cdk.propertyValidator('aribCaptionsPid', cdk.validateString)(properties.aribCaptionsPid));
    errors.collect(cdk.propertyValidator('aribCaptionsPidControl', cdk.validateString)(properties.aribCaptionsPidControl));
    errors.collect(cdk.propertyValidator('audioBufferModel', cdk.validateString)(properties.audioBufferModel));
    errors.collect(cdk.propertyValidator('audioFramesPerPes', cdk.validateNumber)(properties.audioFramesPerPes));
    errors.collect(cdk.propertyValidator('audioPids', cdk.validateString)(properties.audioPids));
    errors.collect(cdk.propertyValidator('audioStreamType', cdk.validateString)(properties.audioStreamType));
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('bufferModel', cdk.validateString)(properties.bufferModel));
    errors.collect(cdk.propertyValidator('ccDescriptor', cdk.validateString)(properties.ccDescriptor));
    errors.collect(cdk.propertyValidator('dvbNitSettings', CfnChannel_DvbNitSettingsPropertyValidator)(properties.dvbNitSettings));
    errors.collect(cdk.propertyValidator('dvbSdtSettings', CfnChannel_DvbSdtSettingsPropertyValidator)(properties.dvbSdtSettings));
    errors.collect(cdk.propertyValidator('dvbSubPids', cdk.validateString)(properties.dvbSubPids));
    errors.collect(cdk.propertyValidator('dvbTdtSettings', CfnChannel_DvbTdtSettingsPropertyValidator)(properties.dvbTdtSettings));
    errors.collect(cdk.propertyValidator('dvbTeletextPid', cdk.validateString)(properties.dvbTeletextPid));
    errors.collect(cdk.propertyValidator('ebif', cdk.validateString)(properties.ebif));
    errors.collect(cdk.propertyValidator('ebpAudioInterval', cdk.validateString)(properties.ebpAudioInterval));
    errors.collect(cdk.propertyValidator('ebpLookaheadMs', cdk.validateNumber)(properties.ebpLookaheadMs));
    errors.collect(cdk.propertyValidator('ebpPlacement', cdk.validateString)(properties.ebpPlacement));
    errors.collect(cdk.propertyValidator('ecmPid', cdk.validateString)(properties.ecmPid));
    errors.collect(cdk.propertyValidator('esRateInPes', cdk.validateString)(properties.esRateInPes));
    errors.collect(cdk.propertyValidator('etvPlatformPid', cdk.validateString)(properties.etvPlatformPid));
    errors.collect(cdk.propertyValidator('etvSignalPid', cdk.validateString)(properties.etvSignalPid));
    errors.collect(cdk.propertyValidator('fragmentTime', cdk.validateNumber)(properties.fragmentTime));
    errors.collect(cdk.propertyValidator('klv', cdk.validateString)(properties.klv));
    errors.collect(cdk.propertyValidator('klvDataPids', cdk.validateString)(properties.klvDataPids));
    errors.collect(cdk.propertyValidator('nielsenId3Behavior', cdk.validateString)(properties.nielsenId3Behavior));
    errors.collect(cdk.propertyValidator('nullPacketBitrate', cdk.validateNumber)(properties.nullPacketBitrate));
    errors.collect(cdk.propertyValidator('patInterval', cdk.validateNumber)(properties.patInterval));
    errors.collect(cdk.propertyValidator('pcrControl', cdk.validateString)(properties.pcrControl));
    errors.collect(cdk.propertyValidator('pcrPeriod', cdk.validateNumber)(properties.pcrPeriod));
    errors.collect(cdk.propertyValidator('pcrPid', cdk.validateString)(properties.pcrPid));
    errors.collect(cdk.propertyValidator('pmtInterval', cdk.validateNumber)(properties.pmtInterval));
    errors.collect(cdk.propertyValidator('pmtPid', cdk.validateString)(properties.pmtPid));
    errors.collect(cdk.propertyValidator('programNum', cdk.validateNumber)(properties.programNum));
    errors.collect(cdk.propertyValidator('rateMode', cdk.validateString)(properties.rateMode));
    errors.collect(cdk.propertyValidator('scte27Pids', cdk.validateString)(properties.scte27Pids));
    errors.collect(cdk.propertyValidator('scte35Control', cdk.validateString)(properties.scte35Control));
    errors.collect(cdk.propertyValidator('scte35Pid', cdk.validateString)(properties.scte35Pid));
    errors.collect(cdk.propertyValidator('segmentationMarkers', cdk.validateString)(properties.segmentationMarkers));
    errors.collect(cdk.propertyValidator('segmentationStyle', cdk.validateString)(properties.segmentationStyle));
    errors.collect(cdk.propertyValidator('segmentationTime', cdk.validateNumber)(properties.segmentationTime));
    errors.collect(cdk.propertyValidator('timedMetadataBehavior', cdk.validateString)(properties.timedMetadataBehavior));
    errors.collect(cdk.propertyValidator('timedMetadataPid', cdk.validateString)(properties.timedMetadataPid));
    errors.collect(cdk.propertyValidator('transportStreamId', cdk.validateNumber)(properties.transportStreamId));
    errors.collect(cdk.propertyValidator('videoPid', cdk.validateString)(properties.videoPid));
    return errors.wrap('supplied properties not correct for "M2tsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.M2tsSettings` resource
 *
 * @param properties - the TypeScript properties of a `M2tsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.M2tsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelM2tsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_M2tsSettingsPropertyValidator(properties).assertSuccess();
    return {
        AbsentInputAudioBehavior: cdk.stringToCloudFormation(properties.absentInputAudioBehavior),
        Arib: cdk.stringToCloudFormation(properties.arib),
        AribCaptionsPid: cdk.stringToCloudFormation(properties.aribCaptionsPid),
        AribCaptionsPidControl: cdk.stringToCloudFormation(properties.aribCaptionsPidControl),
        AudioBufferModel: cdk.stringToCloudFormation(properties.audioBufferModel),
        AudioFramesPerPes: cdk.numberToCloudFormation(properties.audioFramesPerPes),
        AudioPids: cdk.stringToCloudFormation(properties.audioPids),
        AudioStreamType: cdk.stringToCloudFormation(properties.audioStreamType),
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        BufferModel: cdk.stringToCloudFormation(properties.bufferModel),
        CcDescriptor: cdk.stringToCloudFormation(properties.ccDescriptor),
        DvbNitSettings: cfnChannelDvbNitSettingsPropertyToCloudFormation(properties.dvbNitSettings),
        DvbSdtSettings: cfnChannelDvbSdtSettingsPropertyToCloudFormation(properties.dvbSdtSettings),
        DvbSubPids: cdk.stringToCloudFormation(properties.dvbSubPids),
        DvbTdtSettings: cfnChannelDvbTdtSettingsPropertyToCloudFormation(properties.dvbTdtSettings),
        DvbTeletextPid: cdk.stringToCloudFormation(properties.dvbTeletextPid),
        Ebif: cdk.stringToCloudFormation(properties.ebif),
        EbpAudioInterval: cdk.stringToCloudFormation(properties.ebpAudioInterval),
        EbpLookaheadMs: cdk.numberToCloudFormation(properties.ebpLookaheadMs),
        EbpPlacement: cdk.stringToCloudFormation(properties.ebpPlacement),
        EcmPid: cdk.stringToCloudFormation(properties.ecmPid),
        EsRateInPes: cdk.stringToCloudFormation(properties.esRateInPes),
        EtvPlatformPid: cdk.stringToCloudFormation(properties.etvPlatformPid),
        EtvSignalPid: cdk.stringToCloudFormation(properties.etvSignalPid),
        FragmentTime: cdk.numberToCloudFormation(properties.fragmentTime),
        Klv: cdk.stringToCloudFormation(properties.klv),
        KlvDataPids: cdk.stringToCloudFormation(properties.klvDataPids),
        NielsenId3Behavior: cdk.stringToCloudFormation(properties.nielsenId3Behavior),
        NullPacketBitrate: cdk.numberToCloudFormation(properties.nullPacketBitrate),
        PatInterval: cdk.numberToCloudFormation(properties.patInterval),
        PcrControl: cdk.stringToCloudFormation(properties.pcrControl),
        PcrPeriod: cdk.numberToCloudFormation(properties.pcrPeriod),
        PcrPid: cdk.stringToCloudFormation(properties.pcrPid),
        PmtInterval: cdk.numberToCloudFormation(properties.pmtInterval),
        PmtPid: cdk.stringToCloudFormation(properties.pmtPid),
        ProgramNum: cdk.numberToCloudFormation(properties.programNum),
        RateMode: cdk.stringToCloudFormation(properties.rateMode),
        Scte27Pids: cdk.stringToCloudFormation(properties.scte27Pids),
        Scte35Control: cdk.stringToCloudFormation(properties.scte35Control),
        Scte35Pid: cdk.stringToCloudFormation(properties.scte35Pid),
        SegmentationMarkers: cdk.stringToCloudFormation(properties.segmentationMarkers),
        SegmentationStyle: cdk.stringToCloudFormation(properties.segmentationStyle),
        SegmentationTime: cdk.numberToCloudFormation(properties.segmentationTime),
        TimedMetadataBehavior: cdk.stringToCloudFormation(properties.timedMetadataBehavior),
        TimedMetadataPid: cdk.stringToCloudFormation(properties.timedMetadataPid),
        TransportStreamId: cdk.numberToCloudFormation(properties.transportStreamId),
        VideoPid: cdk.stringToCloudFormation(properties.videoPid),
    };
}

// @ts-ignore TS6133
function CfnChannelM2tsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.M2tsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.M2tsSettingsProperty>();
    ret.addPropertyResult('absentInputAudioBehavior', 'AbsentInputAudioBehavior', properties.AbsentInputAudioBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.AbsentInputAudioBehavior) : undefined);
    ret.addPropertyResult('arib', 'Arib', properties.Arib != null ? cfn_parse.FromCloudFormation.getString(properties.Arib) : undefined);
    ret.addPropertyResult('aribCaptionsPid', 'AribCaptionsPid', properties.AribCaptionsPid != null ? cfn_parse.FromCloudFormation.getString(properties.AribCaptionsPid) : undefined);
    ret.addPropertyResult('aribCaptionsPidControl', 'AribCaptionsPidControl', properties.AribCaptionsPidControl != null ? cfn_parse.FromCloudFormation.getString(properties.AribCaptionsPidControl) : undefined);
    ret.addPropertyResult('audioBufferModel', 'AudioBufferModel', properties.AudioBufferModel != null ? cfn_parse.FromCloudFormation.getString(properties.AudioBufferModel) : undefined);
    ret.addPropertyResult('audioFramesPerPes', 'AudioFramesPerPes', properties.AudioFramesPerPes != null ? cfn_parse.FromCloudFormation.getNumber(properties.AudioFramesPerPes) : undefined);
    ret.addPropertyResult('audioPids', 'AudioPids', properties.AudioPids != null ? cfn_parse.FromCloudFormation.getString(properties.AudioPids) : undefined);
    ret.addPropertyResult('audioStreamType', 'AudioStreamType', properties.AudioStreamType != null ? cfn_parse.FromCloudFormation.getString(properties.AudioStreamType) : undefined);
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('bufferModel', 'BufferModel', properties.BufferModel != null ? cfn_parse.FromCloudFormation.getString(properties.BufferModel) : undefined);
    ret.addPropertyResult('ccDescriptor', 'CcDescriptor', properties.CcDescriptor != null ? cfn_parse.FromCloudFormation.getString(properties.CcDescriptor) : undefined);
    ret.addPropertyResult('dvbNitSettings', 'DvbNitSettings', properties.DvbNitSettings != null ? CfnChannelDvbNitSettingsPropertyFromCloudFormation(properties.DvbNitSettings) : undefined);
    ret.addPropertyResult('dvbSdtSettings', 'DvbSdtSettings', properties.DvbSdtSettings != null ? CfnChannelDvbSdtSettingsPropertyFromCloudFormation(properties.DvbSdtSettings) : undefined);
    ret.addPropertyResult('dvbSubPids', 'DvbSubPids', properties.DvbSubPids != null ? cfn_parse.FromCloudFormation.getString(properties.DvbSubPids) : undefined);
    ret.addPropertyResult('dvbTdtSettings', 'DvbTdtSettings', properties.DvbTdtSettings != null ? CfnChannelDvbTdtSettingsPropertyFromCloudFormation(properties.DvbTdtSettings) : undefined);
    ret.addPropertyResult('dvbTeletextPid', 'DvbTeletextPid', properties.DvbTeletextPid != null ? cfn_parse.FromCloudFormation.getString(properties.DvbTeletextPid) : undefined);
    ret.addPropertyResult('ebif', 'Ebif', properties.Ebif != null ? cfn_parse.FromCloudFormation.getString(properties.Ebif) : undefined);
    ret.addPropertyResult('ebpAudioInterval', 'EbpAudioInterval', properties.EbpAudioInterval != null ? cfn_parse.FromCloudFormation.getString(properties.EbpAudioInterval) : undefined);
    ret.addPropertyResult('ebpLookaheadMs', 'EbpLookaheadMs', properties.EbpLookaheadMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.EbpLookaheadMs) : undefined);
    ret.addPropertyResult('ebpPlacement', 'EbpPlacement', properties.EbpPlacement != null ? cfn_parse.FromCloudFormation.getString(properties.EbpPlacement) : undefined);
    ret.addPropertyResult('ecmPid', 'EcmPid', properties.EcmPid != null ? cfn_parse.FromCloudFormation.getString(properties.EcmPid) : undefined);
    ret.addPropertyResult('esRateInPes', 'EsRateInPes', properties.EsRateInPes != null ? cfn_parse.FromCloudFormation.getString(properties.EsRateInPes) : undefined);
    ret.addPropertyResult('etvPlatformPid', 'EtvPlatformPid', properties.EtvPlatformPid != null ? cfn_parse.FromCloudFormation.getString(properties.EtvPlatformPid) : undefined);
    ret.addPropertyResult('etvSignalPid', 'EtvSignalPid', properties.EtvSignalPid != null ? cfn_parse.FromCloudFormation.getString(properties.EtvSignalPid) : undefined);
    ret.addPropertyResult('fragmentTime', 'FragmentTime', properties.FragmentTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.FragmentTime) : undefined);
    ret.addPropertyResult('klv', 'Klv', properties.Klv != null ? cfn_parse.FromCloudFormation.getString(properties.Klv) : undefined);
    ret.addPropertyResult('klvDataPids', 'KlvDataPids', properties.KlvDataPids != null ? cfn_parse.FromCloudFormation.getString(properties.KlvDataPids) : undefined);
    ret.addPropertyResult('nielsenId3Behavior', 'NielsenId3Behavior', properties.NielsenId3Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.NielsenId3Behavior) : undefined);
    ret.addPropertyResult('nullPacketBitrate', 'NullPacketBitrate', properties.NullPacketBitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.NullPacketBitrate) : undefined);
    ret.addPropertyResult('patInterval', 'PatInterval', properties.PatInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.PatInterval) : undefined);
    ret.addPropertyResult('pcrControl', 'PcrControl', properties.PcrControl != null ? cfn_parse.FromCloudFormation.getString(properties.PcrControl) : undefined);
    ret.addPropertyResult('pcrPeriod', 'PcrPeriod', properties.PcrPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PcrPeriod) : undefined);
    ret.addPropertyResult('pcrPid', 'PcrPid', properties.PcrPid != null ? cfn_parse.FromCloudFormation.getString(properties.PcrPid) : undefined);
    ret.addPropertyResult('pmtInterval', 'PmtInterval', properties.PmtInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.PmtInterval) : undefined);
    ret.addPropertyResult('pmtPid', 'PmtPid', properties.PmtPid != null ? cfn_parse.FromCloudFormation.getString(properties.PmtPid) : undefined);
    ret.addPropertyResult('programNum', 'ProgramNum', properties.ProgramNum != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramNum) : undefined);
    ret.addPropertyResult('rateMode', 'RateMode', properties.RateMode != null ? cfn_parse.FromCloudFormation.getString(properties.RateMode) : undefined);
    ret.addPropertyResult('scte27Pids', 'Scte27Pids', properties.Scte27Pids != null ? cfn_parse.FromCloudFormation.getString(properties.Scte27Pids) : undefined);
    ret.addPropertyResult('scte35Control', 'Scte35Control', properties.Scte35Control != null ? cfn_parse.FromCloudFormation.getString(properties.Scte35Control) : undefined);
    ret.addPropertyResult('scte35Pid', 'Scte35Pid', properties.Scte35Pid != null ? cfn_parse.FromCloudFormation.getString(properties.Scte35Pid) : undefined);
    ret.addPropertyResult('segmentationMarkers', 'SegmentationMarkers', properties.SegmentationMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentationMarkers) : undefined);
    ret.addPropertyResult('segmentationStyle', 'SegmentationStyle', properties.SegmentationStyle != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentationStyle) : undefined);
    ret.addPropertyResult('segmentationTime', 'SegmentationTime', properties.SegmentationTime != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentationTime) : undefined);
    ret.addPropertyResult('timedMetadataBehavior', 'TimedMetadataBehavior', properties.TimedMetadataBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataBehavior) : undefined);
    ret.addPropertyResult('timedMetadataPid', 'TimedMetadataPid', properties.TimedMetadataPid != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataPid) : undefined);
    ret.addPropertyResult('transportStreamId', 'TransportStreamId', properties.TransportStreamId != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransportStreamId) : undefined);
    ret.addPropertyResult('videoPid', 'VideoPid', properties.VideoPid != null ? cfn_parse.FromCloudFormation.getString(properties.VideoPid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for the M3U8 container.
     *
     * The parent of this entity is StandardHlsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html
     */
    export interface M3u8SettingsProperty {
        /**
         * The number of audio frames to insert for each PES packet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-audioframesperpes
         */
        readonly audioFramesPerPes?: number;
        /**
         * The PID of the elementary audio streams in the transport stream. Multiple values are accepted, and can be entered in ranges or by comma separation. You can enter the value as a decimal or hexadecimal value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-audiopids
         */
        readonly audioPids?: string;
        /**
         * This parameter is unused and deprecated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-ecmpid
         */
        readonly ecmPid?: string;
        /**
         * If set to passthrough, Nielsen inaudible tones for media tracking will be detected in the input audio and an equivalent ID3 tag will be inserted in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-nielsenid3behavior
         */
        readonly nielsenId3Behavior?: string;
        /**
         * The number of milliseconds between instances of this table in the output transport stream. A value of \"0\" writes out the PMT once per segment file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-patinterval
         */
        readonly patInterval?: number;
        /**
         * When set to pcrEveryPesPacket, a Program Clock Reference value is inserted for every Packetized Elementary Stream (PES) header. This parameter is effective only when the PCR PID is the same as the video or audio elementary stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-pcrcontrol
         */
        readonly pcrControl?: string;
        /**
         * The maximum time, in milliseconds, between Program Clock References (PCRs) inserted into the transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-pcrperiod
         */
        readonly pcrPeriod?: number;
        /**
         * The PID of the Program Clock Reference (PCR) in the transport stream. When no value is given, MediaLive assigns the same value as the video PID. You can enter the value as a decimal or hexadecimal value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-pcrpid
         */
        readonly pcrPid?: string;
        /**
         * The number of milliseconds between instances of this table in the output transport stream. A value of \"0\" writes out the PMT once per segment file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-pmtinterval
         */
        readonly pmtInterval?: number;
        /**
         * The PID for the Program Map Table (PMT) in the transport stream. You can enter the value as a decimal or hexadecimal value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-pmtpid
         */
        readonly pmtPid?: string;
        /**
         * The value of the program number field in the Program Map Table (PMT).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-programnum
         */
        readonly programNum?: number;
        /**
         * If set to passthrough, passes any SCTE-35 signals from the input source to this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-scte35behavior
         */
        readonly scte35Behavior?: string;
        /**
         * The PID of the SCTE-35 stream in the transport stream. You can enter the value as a decimal or hexadecimal value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-scte35pid
         */
        readonly scte35Pid?: string;
        /**
         * When set to passthrough, timed metadata is passed through from input to output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-timedmetadatabehavior
         */
        readonly timedMetadataBehavior?: string;
        /**
         * The PID of the timed metadata stream in the transport stream. You can enter the value as a decimal or hexadecimal value. Valid values are 32 (or 0x20)..8182 (or 0x1ff6).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-timedmetadatapid
         */
        readonly timedMetadataPid?: string;
        /**
         * The value of the transport stream ID field in the Program Map Table (PMT).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-transportstreamid
         */
        readonly transportStreamId?: number;
        /**
         * The PID of the elementary video stream in the transport stream. You can enter the value as a decimal or hexadecimal value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-m3u8settings.html#cfn-medialive-channel-m3u8settings-videopid
         */
        readonly videoPid?: string;
    }
}

/**
 * Determine whether the given properties match those of a `M3u8SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `M3u8SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_M3u8SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioFramesPerPes', cdk.validateNumber)(properties.audioFramesPerPes));
    errors.collect(cdk.propertyValidator('audioPids', cdk.validateString)(properties.audioPids));
    errors.collect(cdk.propertyValidator('ecmPid', cdk.validateString)(properties.ecmPid));
    errors.collect(cdk.propertyValidator('nielsenId3Behavior', cdk.validateString)(properties.nielsenId3Behavior));
    errors.collect(cdk.propertyValidator('patInterval', cdk.validateNumber)(properties.patInterval));
    errors.collect(cdk.propertyValidator('pcrControl', cdk.validateString)(properties.pcrControl));
    errors.collect(cdk.propertyValidator('pcrPeriod', cdk.validateNumber)(properties.pcrPeriod));
    errors.collect(cdk.propertyValidator('pcrPid', cdk.validateString)(properties.pcrPid));
    errors.collect(cdk.propertyValidator('pmtInterval', cdk.validateNumber)(properties.pmtInterval));
    errors.collect(cdk.propertyValidator('pmtPid', cdk.validateString)(properties.pmtPid));
    errors.collect(cdk.propertyValidator('programNum', cdk.validateNumber)(properties.programNum));
    errors.collect(cdk.propertyValidator('scte35Behavior', cdk.validateString)(properties.scte35Behavior));
    errors.collect(cdk.propertyValidator('scte35Pid', cdk.validateString)(properties.scte35Pid));
    errors.collect(cdk.propertyValidator('timedMetadataBehavior', cdk.validateString)(properties.timedMetadataBehavior));
    errors.collect(cdk.propertyValidator('timedMetadataPid', cdk.validateString)(properties.timedMetadataPid));
    errors.collect(cdk.propertyValidator('transportStreamId', cdk.validateNumber)(properties.transportStreamId));
    errors.collect(cdk.propertyValidator('videoPid', cdk.validateString)(properties.videoPid));
    return errors.wrap('supplied properties not correct for "M3u8SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.M3u8Settings` resource
 *
 * @param properties - the TypeScript properties of a `M3u8SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.M3u8Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelM3u8SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_M3u8SettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioFramesPerPes: cdk.numberToCloudFormation(properties.audioFramesPerPes),
        AudioPids: cdk.stringToCloudFormation(properties.audioPids),
        EcmPid: cdk.stringToCloudFormation(properties.ecmPid),
        NielsenId3Behavior: cdk.stringToCloudFormation(properties.nielsenId3Behavior),
        PatInterval: cdk.numberToCloudFormation(properties.patInterval),
        PcrControl: cdk.stringToCloudFormation(properties.pcrControl),
        PcrPeriod: cdk.numberToCloudFormation(properties.pcrPeriod),
        PcrPid: cdk.stringToCloudFormation(properties.pcrPid),
        PmtInterval: cdk.numberToCloudFormation(properties.pmtInterval),
        PmtPid: cdk.stringToCloudFormation(properties.pmtPid),
        ProgramNum: cdk.numberToCloudFormation(properties.programNum),
        Scte35Behavior: cdk.stringToCloudFormation(properties.scte35Behavior),
        Scte35Pid: cdk.stringToCloudFormation(properties.scte35Pid),
        TimedMetadataBehavior: cdk.stringToCloudFormation(properties.timedMetadataBehavior),
        TimedMetadataPid: cdk.stringToCloudFormation(properties.timedMetadataPid),
        TransportStreamId: cdk.numberToCloudFormation(properties.transportStreamId),
        VideoPid: cdk.stringToCloudFormation(properties.videoPid),
    };
}

// @ts-ignore TS6133
function CfnChannelM3u8SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.M3u8SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.M3u8SettingsProperty>();
    ret.addPropertyResult('audioFramesPerPes', 'AudioFramesPerPes', properties.AudioFramesPerPes != null ? cfn_parse.FromCloudFormation.getNumber(properties.AudioFramesPerPes) : undefined);
    ret.addPropertyResult('audioPids', 'AudioPids', properties.AudioPids != null ? cfn_parse.FromCloudFormation.getString(properties.AudioPids) : undefined);
    ret.addPropertyResult('ecmPid', 'EcmPid', properties.EcmPid != null ? cfn_parse.FromCloudFormation.getString(properties.EcmPid) : undefined);
    ret.addPropertyResult('nielsenId3Behavior', 'NielsenId3Behavior', properties.NielsenId3Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.NielsenId3Behavior) : undefined);
    ret.addPropertyResult('patInterval', 'PatInterval', properties.PatInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.PatInterval) : undefined);
    ret.addPropertyResult('pcrControl', 'PcrControl', properties.PcrControl != null ? cfn_parse.FromCloudFormation.getString(properties.PcrControl) : undefined);
    ret.addPropertyResult('pcrPeriod', 'PcrPeriod', properties.PcrPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.PcrPeriod) : undefined);
    ret.addPropertyResult('pcrPid', 'PcrPid', properties.PcrPid != null ? cfn_parse.FromCloudFormation.getString(properties.PcrPid) : undefined);
    ret.addPropertyResult('pmtInterval', 'PmtInterval', properties.PmtInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.PmtInterval) : undefined);
    ret.addPropertyResult('pmtPid', 'PmtPid', properties.PmtPid != null ? cfn_parse.FromCloudFormation.getString(properties.PmtPid) : undefined);
    ret.addPropertyResult('programNum', 'ProgramNum', properties.ProgramNum != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramNum) : undefined);
    ret.addPropertyResult('scte35Behavior', 'Scte35Behavior', properties.Scte35Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Scte35Behavior) : undefined);
    ret.addPropertyResult('scte35Pid', 'Scte35Pid', properties.Scte35Pid != null ? cfn_parse.FromCloudFormation.getString(properties.Scte35Pid) : undefined);
    ret.addPropertyResult('timedMetadataBehavior', 'TimedMetadataBehavior', properties.TimedMetadataBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataBehavior) : undefined);
    ret.addPropertyResult('timedMetadataPid', 'TimedMetadataPid', properties.TimedMetadataPid != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataPid) : undefined);
    ret.addPropertyResult('transportStreamId', 'TransportStreamId', properties.TransportStreamId != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransportStreamId) : undefined);
    ret.addPropertyResult('videoPid', 'VideoPid', properties.VideoPid != null ? cfn_parse.FromCloudFormation.getString(properties.VideoPid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the MediaPackage group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackagegroupsettings.html
     */
    export interface MediaPackageGroupSettingsProperty {
        /**
         * The MediaPackage channel destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackagegroupsettings.html#cfn-medialive-channel-mediapackagegroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MediaPackageGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MediaPackageGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MediaPackageGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    return errors.wrap('supplied properties not correct for "MediaPackageGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `MediaPackageGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMediaPackageGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MediaPackageGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
    };
}

// @ts-ignore TS6133
function CfnChannelMediaPackageGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MediaPackageGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MediaPackageGroupSettingsProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Destination settings for a MediaPackage output.
     *
     * The parent of this entity is OutputDestination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackageoutputdestinationsettings.html
     */
    export interface MediaPackageOutputDestinationSettingsProperty {
        /**
         * The ID of the channel in MediaPackage that is the destination for this output group. You don't need to specify the individual inputs in MediaPackage; MediaLive handles the connection of the two MediaLive pipelines to the two MediaPackage inputs. The MediaPackage channel and MediaLive channel must be in the same Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackageoutputdestinationsettings.html#cfn-medialive-channel-mediapackageoutputdestinationsettings-channelid
         */
        readonly channelId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MediaPackageOutputDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MediaPackageOutputDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MediaPackageOutputDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelId', cdk.validateString)(properties.channelId));
    return errors.wrap('supplied properties not correct for "MediaPackageOutputDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageOutputDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `MediaPackageOutputDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageOutputDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMediaPackageOutputDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MediaPackageOutputDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        ChannelId: cdk.stringToCloudFormation(properties.channelId),
    };
}

// @ts-ignore TS6133
function CfnChannelMediaPackageOutputDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MediaPackageOutputDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MediaPackageOutputDestinationSettingsProperty>();
    ret.addPropertyResult('channelId', 'ChannelId', properties.ChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a MediaPackage output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackageoutputsettings.html
     */
    export interface MediaPackageOutputSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `MediaPackageOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MediaPackageOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MediaPackageOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "MediaPackageOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `MediaPackageOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MediaPackageOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMediaPackageOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MediaPackageOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelMediaPackageOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MediaPackageOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MediaPackageOutputSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to enable and configure the motion graphics overlay feature in the channel.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicsconfiguration.html
     */
    export interface MotionGraphicsConfigurationProperty {
        /**
         * Enables or disables the motion graphics overlay feature in the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicsconfiguration.html#cfn-medialive-channel-motiongraphicsconfiguration-motiongraphicsinsertion
         */
        readonly motionGraphicsInsertion?: string;
        /**
         * Settings to enable and configure the motion graphics overlay feature in the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicsconfiguration.html#cfn-medialive-channel-motiongraphicsconfiguration-motiongraphicssettings
         */
        readonly motionGraphicsSettings?: CfnChannel.MotionGraphicsSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MotionGraphicsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MotionGraphicsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MotionGraphicsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('motionGraphicsInsertion', cdk.validateString)(properties.motionGraphicsInsertion));
    errors.collect(cdk.propertyValidator('motionGraphicsSettings', CfnChannel_MotionGraphicsSettingsPropertyValidator)(properties.motionGraphicsSettings));
    return errors.wrap('supplied properties not correct for "MotionGraphicsConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MotionGraphicsConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `MotionGraphicsConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MotionGraphicsConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnChannelMotionGraphicsConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MotionGraphicsConfigurationPropertyValidator(properties).assertSuccess();
    return {
        MotionGraphicsInsertion: cdk.stringToCloudFormation(properties.motionGraphicsInsertion),
        MotionGraphicsSettings: cfnChannelMotionGraphicsSettingsPropertyToCloudFormation(properties.motionGraphicsSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelMotionGraphicsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MotionGraphicsConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MotionGraphicsConfigurationProperty>();
    ret.addPropertyResult('motionGraphicsInsertion', 'MotionGraphicsInsertion', properties.MotionGraphicsInsertion != null ? cfn_parse.FromCloudFormation.getString(properties.MotionGraphicsInsertion) : undefined);
    ret.addPropertyResult('motionGraphicsSettings', 'MotionGraphicsSettings', properties.MotionGraphicsSettings != null ? CfnChannelMotionGraphicsSettingsPropertyFromCloudFormation(properties.MotionGraphicsSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to enable and configure the motion graphics overlay feature in the channel.
     *
     * The parent of this entity is MotionGraphicsConfiguration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicssettings.html
     */
    export interface MotionGraphicsSettingsProperty {
        /**
         * Settings to configure the motion graphics overlay to use an HTML asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicssettings.html#cfn-medialive-channel-motiongraphicssettings-htmlmotiongraphicssettings
         */
        readonly htmlMotionGraphicsSettings?: CfnChannel.HtmlMotionGraphicsSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MotionGraphicsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MotionGraphicsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MotionGraphicsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('htmlMotionGraphicsSettings', CfnChannel_HtmlMotionGraphicsSettingsPropertyValidator)(properties.htmlMotionGraphicsSettings));
    return errors.wrap('supplied properties not correct for "MotionGraphicsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MotionGraphicsSettings` resource
 *
 * @param properties - the TypeScript properties of a `MotionGraphicsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MotionGraphicsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMotionGraphicsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MotionGraphicsSettingsPropertyValidator(properties).assertSuccess();
    return {
        HtmlMotionGraphicsSettings: cfnChannelHtmlMotionGraphicsSettingsPropertyToCloudFormation(properties.htmlMotionGraphicsSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelMotionGraphicsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MotionGraphicsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MotionGraphicsSettingsProperty>();
    ret.addPropertyResult('htmlMotionGraphicsSettings', 'HtmlMotionGraphicsSettings', properties.HtmlMotionGraphicsSettings != null ? CfnChannelHtmlMotionGraphicsSettingsPropertyFromCloudFormation(properties.HtmlMotionGraphicsSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration for this MP2 audio.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mp2settings.html
     */
    export interface Mp2SettingsProperty {
        /**
         * The average bitrate in bits/second.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mp2settings.html#cfn-medialive-channel-mp2settings-bitrate
         */
        readonly bitrate?: number;
        /**
         * The MPEG2 Audio coding mode. Valid values are codingMode10 (for mono) or codingMode20 (for stereo).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mp2settings.html#cfn-medialive-channel-mp2settings-codingmode
         */
        readonly codingMode?: string;
        /**
         * The sample rate in Hz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mp2settings.html#cfn-medialive-channel-mp2settings-samplerate
         */
        readonly sampleRate?: number;
    }
}

/**
 * Determine whether the given properties match those of a `Mp2SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Mp2SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Mp2SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bitrate', cdk.validateNumber)(properties.bitrate));
    errors.collect(cdk.propertyValidator('codingMode', cdk.validateString)(properties.codingMode));
    errors.collect(cdk.propertyValidator('sampleRate', cdk.validateNumber)(properties.sampleRate));
    return errors.wrap('supplied properties not correct for "Mp2SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mp2Settings` resource
 *
 * @param properties - the TypeScript properties of a `Mp2SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mp2Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMp2SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Mp2SettingsPropertyValidator(properties).assertSuccess();
    return {
        Bitrate: cdk.numberToCloudFormation(properties.bitrate),
        CodingMode: cdk.stringToCloudFormation(properties.codingMode),
        SampleRate: cdk.numberToCloudFormation(properties.sampleRate),
    };
}

// @ts-ignore TS6133
function CfnChannelMp2SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Mp2SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Mp2SettingsProperty>();
    ret.addPropertyResult('bitrate', 'Bitrate', properties.Bitrate != null ? cfn_parse.FromCloudFormation.getNumber(properties.Bitrate) : undefined);
    ret.addPropertyResult('codingMode', 'CodingMode', properties.CodingMode != null ? cfn_parse.FromCloudFormation.getString(properties.CodingMode) : undefined);
    ret.addPropertyResult('sampleRate', 'SampleRate', properties.SampleRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SampleRate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure video filters that apply to the MPEG-2 codec.
     *
     * The parent of this entity is Mpeg2FilterSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2filtersettings.html
     */
    export interface Mpeg2FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2filtersettings.html#cfn-medialive-channel-mpeg2filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `Mpeg2FilterSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Mpeg2FilterSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Mpeg2FilterSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('temporalFilterSettings', CfnChannel_TemporalFilterSettingsPropertyValidator)(properties.temporalFilterSettings));
    return errors.wrap('supplied properties not correct for "Mpeg2FilterSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mpeg2FilterSettings` resource
 *
 * @param properties - the TypeScript properties of a `Mpeg2FilterSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mpeg2FilterSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMpeg2FilterSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Mpeg2FilterSettingsPropertyValidator(properties).assertSuccess();
    return {
        TemporalFilterSettings: cfnChannelTemporalFilterSettingsPropertyToCloudFormation(properties.temporalFilterSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelMpeg2FilterSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Mpeg2FilterSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Mpeg2FilterSettingsProperty>();
    ret.addPropertyResult('temporalFilterSettings', 'TemporalFilterSettings', properties.TemporalFilterSettings != null ? CfnChannelTemporalFilterSettingsPropertyFromCloudFormation(properties.TemporalFilterSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the MPEG-2 codec in the output.
     *
     * The parent of this entity is VideoCodecSetting.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html
     */
    export interface Mpeg2SettingsProperty {
        /**
         * Choose Off to disable adaptive quantization. Or choose another value to enable the quantizer and set its strength. The strengths are: Auto, Off, Low, Medium, High. When you enable this field, MediaLive allows intra-frame quantizers to vary, which might improve visual quality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-adaptivequantization
         */
        readonly adaptiveQuantization?: string;
        /**
         * Indicates the AFD values that MediaLive will write into the video encode. If you do not know what AFD signaling is, or if your downstream system has not given you guidance, choose AUTO.
         * AUTO: MediaLive will try to preserve the input AFD value (in cases where multiple AFD values are valid).
         * FIXED: MediaLive will use the value you specify in fixedAFD.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-afdsignaling
         */
        readonly afdSignaling?: string;
        /**
         * Specifies whether to include the color space metadata. The metadata describes the color space that applies to the video (the colorSpace field). We recommend that you insert the metadata.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-colormetadata
         */
        readonly colorMetadata?: string;
        /**
         * Choose the type of color space conversion to apply to the output. For detailed information on setting up both the input and the output to obtain the desired color space in the output, see the section on \"MediaLive Features - Video - color space\" in the MediaLive User Guide.
         * PASSTHROUGH: Keep the color space of the input content - do not convert it.
         * AUTO:Convert all content that is SD to rec 601, and convert all content that is HD to rec 709.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-colorspace
         */
        readonly colorSpace?: string;
        /**
         * Sets the pixel aspect ratio for the encode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-displayaspectratio
         */
        readonly displayAspectRatio?: string;
        /**
         * Optionally specify a noise reduction filter, which can improve quality of compressed content. If you do not choose a filter, no filter will be applied.
         * TEMPORAL: This filter is useful for both source content that is noisy (when it has excessive digital artifacts) and source content that is clean.
         * When the content is noisy, the filter cleans up the source content before the encoding phase, with these two effects: First, it improves the output video quality because the content has been cleaned up. Secondly, it decreases the bandwidth because MediaLive does not waste bits on encoding noise.
         * When the content is reasonably clean, the filter tends to decrease the bitrate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-filtersettings
         */
        readonly filterSettings?: CfnChannel.Mpeg2FilterSettingsProperty | cdk.IResolvable;
        /**
         * Complete this field only when afdSignaling is set to FIXED. Enter the AFD value (4 bits) to write on all frames of the video encode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-fixedafd
         */
        readonly fixedAfd?: string;
        /**
         * description": "The framerate denominator. For example, 1001. The framerate is the numerator divided by the denominator. For example, 24000 / 1001 = 23.976 FPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-frameratedenominator
         */
        readonly framerateDenominator?: number;
        /**
         * The framerate numerator. For example, 24000. The framerate is the numerator divided by the denominator. For example, 24000 / 1001 = 23.976 FPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-frameratenumerator
         */
        readonly framerateNumerator?: number;
        /**
         * MPEG2: default is open GOP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-gopclosedcadence
         */
        readonly gopClosedCadence?: number;
        /**
         * Relates to the GOP structure. The number of B-frames between reference frames. If you do not know what a B-frame is, use the default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-gopnumbframes
         */
        readonly gopNumBFrames?: number;
        /**
         * Relates to the GOP structure. The GOP size (keyframe interval) in the units specified in gopSizeUnits. If you do not know what GOP is, use the default.
         * If gopSizeUnits is frames, then the gopSize must be an integer and must be greater than or equal to 1.
         * If gopSizeUnits is seconds, the gopSize must be greater than 0, but does not need to be an integer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-gopsize
         */
        readonly gopSize?: number;
        /**
         * Relates to the GOP structure. Specifies whether the gopSize is specified in frames or seconds. If you do not plan to change the default gopSize, leave the default. If you specify SECONDS, MediaLive will internally convert the gop size to a frame count.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-gopsizeunits
         */
        readonly gopSizeUnits?: string;
        /**
         * Set the scan type of the output to PROGRESSIVE or INTERLACED (top field first).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-scantype
         */
        readonly scanType?: string;
        /**
         * Relates to the GOP structure. If you do not know what GOP is, use the default.
         * FIXED: Set the number of B-frames in each sub-GOP to the value in gopNumBFrames.
         * DYNAMIC: Let MediaLive optimize the number of B-frames in each sub-GOP, to improve visual quality.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-subgoplength
         */
        readonly subgopLength?: string;
        /**
         * Determines how MediaLive inserts timecodes in the output video. For detailed information about setting up the input and the output for a timecode, see the section on \"MediaLive Features - Timecode configuration\" in the MediaLive User Guide.
         * DISABLED: do not include timecodes.
         * GOP_TIMECODE: Include timecode metadata in the GOP header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2settings.html#cfn-medialive-channel-mpeg2settings-timecodeinsertion
         */
        readonly timecodeInsertion?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Mpeg2SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Mpeg2SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Mpeg2SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adaptiveQuantization', cdk.validateString)(properties.adaptiveQuantization));
    errors.collect(cdk.propertyValidator('afdSignaling', cdk.validateString)(properties.afdSignaling));
    errors.collect(cdk.propertyValidator('colorMetadata', cdk.validateString)(properties.colorMetadata));
    errors.collect(cdk.propertyValidator('colorSpace', cdk.validateString)(properties.colorSpace));
    errors.collect(cdk.propertyValidator('displayAspectRatio', cdk.validateString)(properties.displayAspectRatio));
    errors.collect(cdk.propertyValidator('filterSettings', CfnChannel_Mpeg2FilterSettingsPropertyValidator)(properties.filterSettings));
    errors.collect(cdk.propertyValidator('fixedAfd', cdk.validateString)(properties.fixedAfd));
    errors.collect(cdk.propertyValidator('framerateDenominator', cdk.validateNumber)(properties.framerateDenominator));
    errors.collect(cdk.propertyValidator('framerateNumerator', cdk.validateNumber)(properties.framerateNumerator));
    errors.collect(cdk.propertyValidator('gopClosedCadence', cdk.validateNumber)(properties.gopClosedCadence));
    errors.collect(cdk.propertyValidator('gopNumBFrames', cdk.validateNumber)(properties.gopNumBFrames));
    errors.collect(cdk.propertyValidator('gopSize', cdk.validateNumber)(properties.gopSize));
    errors.collect(cdk.propertyValidator('gopSizeUnits', cdk.validateString)(properties.gopSizeUnits));
    errors.collect(cdk.propertyValidator('scanType', cdk.validateString)(properties.scanType));
    errors.collect(cdk.propertyValidator('subgopLength', cdk.validateString)(properties.subgopLength));
    errors.collect(cdk.propertyValidator('timecodeInsertion', cdk.validateString)(properties.timecodeInsertion));
    return errors.wrap('supplied properties not correct for "Mpeg2SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mpeg2Settings` resource
 *
 * @param properties - the TypeScript properties of a `Mpeg2SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Mpeg2Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMpeg2SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Mpeg2SettingsPropertyValidator(properties).assertSuccess();
    return {
        AdaptiveQuantization: cdk.stringToCloudFormation(properties.adaptiveQuantization),
        AfdSignaling: cdk.stringToCloudFormation(properties.afdSignaling),
        ColorMetadata: cdk.stringToCloudFormation(properties.colorMetadata),
        ColorSpace: cdk.stringToCloudFormation(properties.colorSpace),
        DisplayAspectRatio: cdk.stringToCloudFormation(properties.displayAspectRatio),
        FilterSettings: cfnChannelMpeg2FilterSettingsPropertyToCloudFormation(properties.filterSettings),
        FixedAfd: cdk.stringToCloudFormation(properties.fixedAfd),
        FramerateDenominator: cdk.numberToCloudFormation(properties.framerateDenominator),
        FramerateNumerator: cdk.numberToCloudFormation(properties.framerateNumerator),
        GopClosedCadence: cdk.numberToCloudFormation(properties.gopClosedCadence),
        GopNumBFrames: cdk.numberToCloudFormation(properties.gopNumBFrames),
        GopSize: cdk.numberToCloudFormation(properties.gopSize),
        GopSizeUnits: cdk.stringToCloudFormation(properties.gopSizeUnits),
        ScanType: cdk.stringToCloudFormation(properties.scanType),
        SubgopLength: cdk.stringToCloudFormation(properties.subgopLength),
        TimecodeInsertion: cdk.stringToCloudFormation(properties.timecodeInsertion),
    };
}

// @ts-ignore TS6133
function CfnChannelMpeg2SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Mpeg2SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Mpeg2SettingsProperty>();
    ret.addPropertyResult('adaptiveQuantization', 'AdaptiveQuantization', properties.AdaptiveQuantization != null ? cfn_parse.FromCloudFormation.getString(properties.AdaptiveQuantization) : undefined);
    ret.addPropertyResult('afdSignaling', 'AfdSignaling', properties.AfdSignaling != null ? cfn_parse.FromCloudFormation.getString(properties.AfdSignaling) : undefined);
    ret.addPropertyResult('colorMetadata', 'ColorMetadata', properties.ColorMetadata != null ? cfn_parse.FromCloudFormation.getString(properties.ColorMetadata) : undefined);
    ret.addPropertyResult('colorSpace', 'ColorSpace', properties.ColorSpace != null ? cfn_parse.FromCloudFormation.getString(properties.ColorSpace) : undefined);
    ret.addPropertyResult('displayAspectRatio', 'DisplayAspectRatio', properties.DisplayAspectRatio != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayAspectRatio) : undefined);
    ret.addPropertyResult('filterSettings', 'FilterSettings', properties.FilterSettings != null ? CfnChannelMpeg2FilterSettingsPropertyFromCloudFormation(properties.FilterSettings) : undefined);
    ret.addPropertyResult('fixedAfd', 'FixedAfd', properties.FixedAfd != null ? cfn_parse.FromCloudFormation.getString(properties.FixedAfd) : undefined);
    ret.addPropertyResult('framerateDenominator', 'FramerateDenominator', properties.FramerateDenominator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateDenominator) : undefined);
    ret.addPropertyResult('framerateNumerator', 'FramerateNumerator', properties.FramerateNumerator != null ? cfn_parse.FromCloudFormation.getNumber(properties.FramerateNumerator) : undefined);
    ret.addPropertyResult('gopClosedCadence', 'GopClosedCadence', properties.GopClosedCadence != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopClosedCadence) : undefined);
    ret.addPropertyResult('gopNumBFrames', 'GopNumBFrames', properties.GopNumBFrames != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopNumBFrames) : undefined);
    ret.addPropertyResult('gopSize', 'GopSize', properties.GopSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.GopSize) : undefined);
    ret.addPropertyResult('gopSizeUnits', 'GopSizeUnits', properties.GopSizeUnits != null ? cfn_parse.FromCloudFormation.getString(properties.GopSizeUnits) : undefined);
    ret.addPropertyResult('scanType', 'ScanType', properties.ScanType != null ? cfn_parse.FromCloudFormation.getString(properties.ScanType) : undefined);
    ret.addPropertyResult('subgopLength', 'SubgopLength', properties.SubgopLength != null ? cfn_parse.FromCloudFormation.getString(properties.SubgopLength) : undefined);
    ret.addPropertyResult('timecodeInsertion', 'TimecodeInsertion', properties.TimecodeInsertion != null ? cfn_parse.FromCloudFormation.getString(properties.TimecodeInsertion) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a Microsoft Smooth output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html
     */
    export interface MsSmoothGroupSettingsProperty {
        /**
         * The value of the Acquisition Point Identity element that is used in each message placed in the sparse track. Enabled only if sparseTrackType is not "none."
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-acquisitionpointid
         */
        readonly acquisitionPointId?: string;
        /**
         * If set to passthrough for an audio-only Microsoft Smooth output, the fragment absolute time is set to the current timecode. This option does not write timecodes to the audio elementary stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-audioonlytimecodecontrol
         */
        readonly audioOnlyTimecodeControl?: string;
        /**
         * If set to verifyAuthenticity, verifies the HTTPS certificate chain to a trusted certificate authority (CA). This causes HTTPS outputs to self-signed certificates to fail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-certificatemode
         */
        readonly certificateMode?: string;
        /**
         * The number of seconds to wait before retrying the connection to the IIS server if the connection is lost. Content is cached during this time, and the cache is delivered to the IIS server after the connection is re-established.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The Smooth Streaming publish point on an IIS server. MediaLive acts as a "Push" encoder to IIS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * The Microsoft Smooth channel ID that is sent to the IIS server. Specify the ID only if eventIdMode is set to useConfigured.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-eventid
         */
        readonly eventId?: string;
        /**
         * Specifies whether to send a channel ID to the IIS server. If no channel ID is sent and the same channel is used without changing the publishing point, clients might see cached video from the previous run. Options: - "useConfigured" - use the value provided in eventId - "useTimestamp" - generate and send a channel ID based on the current timestamp - "noEventId" - do not send a channel ID to the IIS server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-eventidmode
         */
        readonly eventIdMode?: string;
        /**
         * When set to sendEos, sends an EOS signal to an IIS server when stopping the channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-eventstopbehavior
         */
        readonly eventStopBehavior?: string;
        /**
         * The size, in seconds, of the file cache for streaming outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-filecacheduration
         */
        readonly filecacheDuration?: number;
        /**
         * The length, in seconds, of mp4 fragments to generate. The fragment length must be compatible with GOP size and frame rate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-fragmentlength
         */
        readonly fragmentLength?: number;
        /**
         * A parameter that controls output group behavior on an input loss.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-inputlossaction
         */
        readonly inputLossAction?: string;
        /**
         * The number of retry attempts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-numretries
         */
        readonly numRetries?: number;
        /**
         * The number of seconds before initiating a restart due to output failure, due to exhausting the numRetries on one segment, or exceeding filecacheDuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-restartdelay
         */
        readonly restartDelay?: number;
        /**
         * useInputSegmentation has been deprecated. The configured segment size is always used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-segmentationmode
         */
        readonly segmentationMode?: string;
        /**
         * The number of milliseconds to delay the output from the second pipeline.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-senddelayms
         */
        readonly sendDelayMs?: number;
        /**
         * If set to scte35, uses incoming SCTE-35 messages to generate a sparse track in this group of Microsoft Smooth outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-sparsetracktype
         */
        readonly sparseTrackType?: string;
        /**
         * When set to send, sends a stream manifest so that the publishing point doesn't start until all streams start.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-streammanifestbehavior
         */
        readonly streamManifestBehavior?: string;
        /**
         * The timestamp offset for the channel. Used only if timestampOffsetMode is set to useConfiguredOffset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-timestampoffset
         */
        readonly timestampOffset?: string;
        /**
         * The type of timestamp date offset to use. - useEventStartDate: Use the date the channel was started as the offset - useConfiguredOffset: Use an explicitly configured date as the offset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothgroupsettings.html#cfn-medialive-channel-mssmoothgroupsettings-timestampoffsetmode
         */
        readonly timestampOffsetMode?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MsSmoothGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MsSmoothGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MsSmoothGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('acquisitionPointId', cdk.validateString)(properties.acquisitionPointId));
    errors.collect(cdk.propertyValidator('audioOnlyTimecodeControl', cdk.validateString)(properties.audioOnlyTimecodeControl));
    errors.collect(cdk.propertyValidator('certificateMode', cdk.validateString)(properties.certificateMode));
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('eventId', cdk.validateString)(properties.eventId));
    errors.collect(cdk.propertyValidator('eventIdMode', cdk.validateString)(properties.eventIdMode));
    errors.collect(cdk.propertyValidator('eventStopBehavior', cdk.validateString)(properties.eventStopBehavior));
    errors.collect(cdk.propertyValidator('filecacheDuration', cdk.validateNumber)(properties.filecacheDuration));
    errors.collect(cdk.propertyValidator('fragmentLength', cdk.validateNumber)(properties.fragmentLength));
    errors.collect(cdk.propertyValidator('inputLossAction', cdk.validateString)(properties.inputLossAction));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    errors.collect(cdk.propertyValidator('segmentationMode', cdk.validateString)(properties.segmentationMode));
    errors.collect(cdk.propertyValidator('sendDelayMs', cdk.validateNumber)(properties.sendDelayMs));
    errors.collect(cdk.propertyValidator('sparseTrackType', cdk.validateString)(properties.sparseTrackType));
    errors.collect(cdk.propertyValidator('streamManifestBehavior', cdk.validateString)(properties.streamManifestBehavior));
    errors.collect(cdk.propertyValidator('timestampOffset', cdk.validateString)(properties.timestampOffset));
    errors.collect(cdk.propertyValidator('timestampOffsetMode', cdk.validateString)(properties.timestampOffsetMode));
    return errors.wrap('supplied properties not correct for "MsSmoothGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MsSmoothGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `MsSmoothGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MsSmoothGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMsSmoothGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MsSmoothGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        AcquisitionPointId: cdk.stringToCloudFormation(properties.acquisitionPointId),
        AudioOnlyTimecodeControl: cdk.stringToCloudFormation(properties.audioOnlyTimecodeControl),
        CertificateMode: cdk.stringToCloudFormation(properties.certificateMode),
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        EventId: cdk.stringToCloudFormation(properties.eventId),
        EventIdMode: cdk.stringToCloudFormation(properties.eventIdMode),
        EventStopBehavior: cdk.stringToCloudFormation(properties.eventStopBehavior),
        FilecacheDuration: cdk.numberToCloudFormation(properties.filecacheDuration),
        FragmentLength: cdk.numberToCloudFormation(properties.fragmentLength),
        InputLossAction: cdk.stringToCloudFormation(properties.inputLossAction),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
        SegmentationMode: cdk.stringToCloudFormation(properties.segmentationMode),
        SendDelayMs: cdk.numberToCloudFormation(properties.sendDelayMs),
        SparseTrackType: cdk.stringToCloudFormation(properties.sparseTrackType),
        StreamManifestBehavior: cdk.stringToCloudFormation(properties.streamManifestBehavior),
        TimestampOffset: cdk.stringToCloudFormation(properties.timestampOffset),
        TimestampOffsetMode: cdk.stringToCloudFormation(properties.timestampOffsetMode),
    };
}

// @ts-ignore TS6133
function CfnChannelMsSmoothGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MsSmoothGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MsSmoothGroupSettingsProperty>();
    ret.addPropertyResult('acquisitionPointId', 'AcquisitionPointId', properties.AcquisitionPointId != null ? cfn_parse.FromCloudFormation.getString(properties.AcquisitionPointId) : undefined);
    ret.addPropertyResult('audioOnlyTimecodeControl', 'AudioOnlyTimecodeControl', properties.AudioOnlyTimecodeControl != null ? cfn_parse.FromCloudFormation.getString(properties.AudioOnlyTimecodeControl) : undefined);
    ret.addPropertyResult('certificateMode', 'CertificateMode', properties.CertificateMode != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateMode) : undefined);
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('eventId', 'EventId', properties.EventId != null ? cfn_parse.FromCloudFormation.getString(properties.EventId) : undefined);
    ret.addPropertyResult('eventIdMode', 'EventIdMode', properties.EventIdMode != null ? cfn_parse.FromCloudFormation.getString(properties.EventIdMode) : undefined);
    ret.addPropertyResult('eventStopBehavior', 'EventStopBehavior', properties.EventStopBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.EventStopBehavior) : undefined);
    ret.addPropertyResult('filecacheDuration', 'FilecacheDuration', properties.FilecacheDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.FilecacheDuration) : undefined);
    ret.addPropertyResult('fragmentLength', 'FragmentLength', properties.FragmentLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.FragmentLength) : undefined);
    ret.addPropertyResult('inputLossAction', 'InputLossAction', properties.InputLossAction != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossAction) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addPropertyResult('segmentationMode', 'SegmentationMode', properties.SegmentationMode != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentationMode) : undefined);
    ret.addPropertyResult('sendDelayMs', 'SendDelayMs', properties.SendDelayMs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SendDelayMs) : undefined);
    ret.addPropertyResult('sparseTrackType', 'SparseTrackType', properties.SparseTrackType != null ? cfn_parse.FromCloudFormation.getString(properties.SparseTrackType) : undefined);
    ret.addPropertyResult('streamManifestBehavior', 'StreamManifestBehavior', properties.StreamManifestBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.StreamManifestBehavior) : undefined);
    ret.addPropertyResult('timestampOffset', 'TimestampOffset', properties.TimestampOffset != null ? cfn_parse.FromCloudFormation.getString(properties.TimestampOffset) : undefined);
    ret.addPropertyResult('timestampOffsetMode', 'TimestampOffsetMode', properties.TimestampOffsetMode != null ? cfn_parse.FromCloudFormation.getString(properties.TimestampOffsetMode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Configuration of a Microsoft Smooth output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothoutputsettings.html
     */
    export interface MsSmoothOutputSettingsProperty {
        /**
         * Only applicable when this output is referencing an H.265 video description.
         * Specifies whether MP4 segments should be packaged as HEV1 or HVC1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothoutputsettings.html#cfn-medialive-channel-mssmoothoutputsettings-h265packagingtype
         */
        readonly h265PackagingType?: string;
        /**
         * A string that is concatenated to the end of the destination file name. This is required for multiple outputs of the same type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mssmoothoutputsettings.html#cfn-medialive-channel-mssmoothoutputsettings-namemodifier
         */
        readonly nameModifier?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MsSmoothOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MsSmoothOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MsSmoothOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('h265PackagingType', cdk.validateString)(properties.h265PackagingType));
    errors.collect(cdk.propertyValidator('nameModifier', cdk.validateString)(properties.nameModifier));
    return errors.wrap('supplied properties not correct for "MsSmoothOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MsSmoothOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `MsSmoothOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MsSmoothOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMsSmoothOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MsSmoothOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        H265PackagingType: cdk.stringToCloudFormation(properties.h265PackagingType),
        NameModifier: cdk.stringToCloudFormation(properties.nameModifier),
    };
}

// @ts-ignore TS6133
function CfnChannelMsSmoothOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MsSmoothOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MsSmoothOutputSettingsProperty>();
    ret.addPropertyResult('h265PackagingType', 'H265PackagingType', properties.H265PackagingType != null ? cfn_parse.FromCloudFormation.getString(properties.H265PackagingType) : undefined);
    ret.addPropertyResult('nameModifier', 'NameModifier', properties.NameModifier != null ? cfn_parse.FromCloudFormation.getString(properties.NameModifier) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a Multiplex output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexgroupsettings.html
     */
    export interface MultiplexGroupSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `MultiplexGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MultiplexGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MultiplexGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "MultiplexGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `MultiplexGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMultiplexGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MultiplexGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelMultiplexGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MultiplexGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MultiplexGroupSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Configuration of a Multiplex output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexoutputsettings.html
     */
    export interface MultiplexOutputSettingsProperty {
        /**
         * Destination is a Multiplex.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexoutputsettings.html#cfn-medialive-channel-multiplexoutputsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `MultiplexOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MultiplexOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MultiplexOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    return errors.wrap('supplied properties not correct for "MultiplexOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `MultiplexOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMultiplexOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MultiplexOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
    };
}

// @ts-ignore TS6133
function CfnChannelMultiplexOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MultiplexOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MultiplexOutputSettingsProperty>();
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Destination settings for a Multiplex output.
     *
     * The parent of this entity is OutputDestination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexprogramchanneldestinationsettings.html
     */
    export interface MultiplexProgramChannelDestinationSettingsProperty {
        /**
         * The ID of the Multiplex that the encoder is providing output to. You do not need to specify the individual inputs to the Multiplex; MediaLive will handle the connection of the two MediaLive pipelines to the two Multiplex instances.
         * The Multiplex must be in the same region as the Channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexprogramchanneldestinationsettings.html#cfn-medialive-channel-multiplexprogramchanneldestinationsettings-multiplexid
         */
        readonly multiplexId?: string;
        /**
         * The program name of the Multiplex program that the encoder is providing output to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexprogramchanneldestinationsettings.html#cfn-medialive-channel-multiplexprogramchanneldestinationsettings-programname
         */
        readonly programName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MultiplexProgramChannelDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `MultiplexProgramChannelDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_MultiplexProgramChannelDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('multiplexId', cdk.validateString)(properties.multiplexId));
    errors.collect(cdk.propertyValidator('programName', cdk.validateString)(properties.programName));
    return errors.wrap('supplied properties not correct for "MultiplexProgramChannelDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexProgramChannelDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `MultiplexProgramChannelDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.MultiplexProgramChannelDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelMultiplexProgramChannelDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_MultiplexProgramChannelDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        MultiplexId: cdk.stringToCloudFormation(properties.multiplexId),
        ProgramName: cdk.stringToCloudFormation(properties.programName),
    };
}

// @ts-ignore TS6133
function CfnChannelMultiplexProgramChannelDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.MultiplexProgramChannelDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.MultiplexProgramChannelDestinationSettingsProperty>();
    ret.addPropertyResult('multiplexId', 'MultiplexId', properties.MultiplexId != null ? cfn_parse.FromCloudFormation.getString(properties.MultiplexId) : undefined);
    ret.addPropertyResult('programName', 'ProgramName', properties.ProgramName != null ? cfn_parse.FromCloudFormation.getString(properties.ProgramName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about how to connect to the upstream system.
     *
     * The parent of this entity is InputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-networkinputsettings.html
     */
    export interface NetworkInputSettingsProperty {
        /**
         * Information about how to connect to the upstream system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-networkinputsettings.html#cfn-medialive-channel-networkinputsettings-hlsinputsettings
         */
        readonly hlsInputSettings?: CfnChannel.HlsInputSettingsProperty | cdk.IResolvable;
        /**
         * Checks HTTPS server certificates. When set to checkCryptographyOnly, cryptography in the certificate is checked, but not the server's name. Certain subdomains (notably S3 buckets that use dots in the bucket name) don't strictly match the corresponding certificate's wildcard pattern and would otherwise cause the channel to error. This setting is ignored for protocols that do not use HTTPS.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-networkinputsettings.html#cfn-medialive-channel-networkinputsettings-servervalidation
         */
        readonly serverValidation?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NetworkInputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkInputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_NetworkInputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hlsInputSettings', CfnChannel_HlsInputSettingsPropertyValidator)(properties.hlsInputSettings));
    errors.collect(cdk.propertyValidator('serverValidation', cdk.validateString)(properties.serverValidation));
    return errors.wrap('supplied properties not correct for "NetworkInputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NetworkInputSettings` resource
 *
 * @param properties - the TypeScript properties of a `NetworkInputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NetworkInputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelNetworkInputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_NetworkInputSettingsPropertyValidator(properties).assertSuccess();
    return {
        HlsInputSettings: cfnChannelHlsInputSettingsPropertyToCloudFormation(properties.hlsInputSettings),
        ServerValidation: cdk.stringToCloudFormation(properties.serverValidation),
    };
}

// @ts-ignore TS6133
function CfnChannelNetworkInputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.NetworkInputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.NetworkInputSettingsProperty>();
    ret.addPropertyResult('hlsInputSettings', 'HlsInputSettings', properties.HlsInputSettings != null ? CfnChannelHlsInputSettingsPropertyFromCloudFormation(properties.HlsInputSettings) : undefined);
    ret.addPropertyResult('serverValidation', 'ServerValidation', properties.ServerValidation != null ? cfn_parse.FromCloudFormation.getString(properties.ServerValidation) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Complete these fields only if you want to insert watermarks of type Nielsen CBET
     *
     * The parent of this entity is NielsenWatermarksSettings
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsencbet.html
     */
    export interface NielsenCBETProperty {
        /**
         * Enter the CBET check digits to use in the watermark.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsencbet.html#cfn-medialive-channel-nielsencbet-cbetcheckdigitstring
         */
        readonly cbetCheckDigitString?: string;
        /**
         * Determines the method of CBET insertion mode when prior encoding is detected on the same layer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsencbet.html#cfn-medialive-channel-nielsencbet-cbetstepaside
         */
        readonly cbetStepaside?: string;
        /**
         * Enter the CBET Source ID (CSID) to use in the watermark
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsencbet.html#cfn-medialive-channel-nielsencbet-csid
         */
        readonly csid?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NielsenCBETProperty`
 *
 * @param properties - the TypeScript properties of a `NielsenCBETProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_NielsenCBETPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cbetCheckDigitString', cdk.validateString)(properties.cbetCheckDigitString));
    errors.collect(cdk.propertyValidator('cbetStepaside', cdk.validateString)(properties.cbetStepaside));
    errors.collect(cdk.propertyValidator('csid', cdk.validateString)(properties.csid));
    return errors.wrap('supplied properties not correct for "NielsenCBETProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenCBET` resource
 *
 * @param properties - the TypeScript properties of a `NielsenCBETProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenCBET` resource.
 */
// @ts-ignore TS6133
function cfnChannelNielsenCBETPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_NielsenCBETPropertyValidator(properties).assertSuccess();
    return {
        CbetCheckDigitString: cdk.stringToCloudFormation(properties.cbetCheckDigitString),
        CbetStepaside: cdk.stringToCloudFormation(properties.cbetStepaside),
        Csid: cdk.stringToCloudFormation(properties.csid),
    };
}

// @ts-ignore TS6133
function CfnChannelNielsenCBETPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.NielsenCBETProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.NielsenCBETProperty>();
    ret.addPropertyResult('cbetCheckDigitString', 'CbetCheckDigitString', properties.CbetCheckDigitString != null ? cfn_parse.FromCloudFormation.getString(properties.CbetCheckDigitString) : undefined);
    ret.addPropertyResult('cbetStepaside', 'CbetStepaside', properties.CbetStepaside != null ? cfn_parse.FromCloudFormation.getString(properties.CbetStepaside) : undefined);
    ret.addPropertyResult('csid', 'Csid', properties.Csid != null ? cfn_parse.FromCloudFormation.getString(properties.Csid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings to configure Nielsen watermarks.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenconfiguration.html
     */
    export interface NielsenConfigurationProperty {
        /**
         * Enter the Distributor ID assigned to your organization by Nielsen.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenconfiguration.html#cfn-medialive-channel-nielsenconfiguration-distributorid
         */
        readonly distributorId?: string;
        /**
         * Enables Nielsen PCM to ID3 tagging
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenconfiguration.html#cfn-medialive-channel-nielsenconfiguration-nielsenpcmtoid3tagging
         */
        readonly nielsenPcmToId3Tagging?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NielsenConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NielsenConfigurationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_NielsenConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('distributorId', cdk.validateString)(properties.distributorId));
    errors.collect(cdk.propertyValidator('nielsenPcmToId3Tagging', cdk.validateString)(properties.nielsenPcmToId3Tagging));
    return errors.wrap('supplied properties not correct for "NielsenConfigurationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `NielsenConfigurationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnChannelNielsenConfigurationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_NielsenConfigurationPropertyValidator(properties).assertSuccess();
    return {
        DistributorId: cdk.stringToCloudFormation(properties.distributorId),
        NielsenPcmToId3Tagging: cdk.stringToCloudFormation(properties.nielsenPcmToId3Tagging),
    };
}

// @ts-ignore TS6133
function CfnChannelNielsenConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.NielsenConfigurationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.NielsenConfigurationProperty>();
    ret.addPropertyResult('distributorId', 'DistributorId', properties.DistributorId != null ? cfn_parse.FromCloudFormation.getString(properties.DistributorId) : undefined);
    ret.addPropertyResult('nielsenPcmToId3Tagging', 'NielsenPcmToId3Tagging', properties.NielsenPcmToId3Tagging != null ? cfn_parse.FromCloudFormation.getString(properties.NielsenPcmToId3Tagging) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Complete these fields only if you want to insert watermarks of type Nielsen NAES II (N2) and Nielsen NAES VI (NW).
     *
     * The parent of this entity is NielsenWatermarksSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsennaesiinw.html
     */
    export interface NielsenNaesIiNwProperty {
        /**
         * Enter the check digit string for the watermark
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsennaesiinw.html#cfn-medialive-channel-nielsennaesiinw-checkdigitstring
         */
        readonly checkDigitString?: string;
        /**
         * Enter the Nielsen Source ID (SID) to include in the watermark
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsennaesiinw.html#cfn-medialive-channel-nielsennaesiinw-sid
         */
        readonly sid?: number;
    }
}

/**
 * Determine whether the given properties match those of a `NielsenNaesIiNwProperty`
 *
 * @param properties - the TypeScript properties of a `NielsenNaesIiNwProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_NielsenNaesIiNwPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('checkDigitString', cdk.validateString)(properties.checkDigitString));
    errors.collect(cdk.propertyValidator('sid', cdk.validateNumber)(properties.sid));
    return errors.wrap('supplied properties not correct for "NielsenNaesIiNwProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenNaesIiNw` resource
 *
 * @param properties - the TypeScript properties of a `NielsenNaesIiNwProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenNaesIiNw` resource.
 */
// @ts-ignore TS6133
function cfnChannelNielsenNaesIiNwPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_NielsenNaesIiNwPropertyValidator(properties).assertSuccess();
    return {
        CheckDigitString: cdk.stringToCloudFormation(properties.checkDigitString),
        Sid: cdk.numberToCloudFormation(properties.sid),
    };
}

// @ts-ignore TS6133
function CfnChannelNielsenNaesIiNwPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.NielsenNaesIiNwProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.NielsenNaesIiNwProperty>();
    ret.addPropertyResult('checkDigitString', 'CheckDigitString', properties.CheckDigitString != null ? cfn_parse.FromCloudFormation.getString(properties.CheckDigitString) : undefined);
    ret.addPropertyResult('sid', 'Sid', properties.Sid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Sid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure Nielsen Watermarks in the audio encode.
     *
     * The parent of this entity is AudioWatermarkSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenwatermarkssettings.html
     */
    export interface NielsenWatermarksSettingsProperty {
        /**
         * Complete these fields only if you want to insert watermarks of type Nielsen CBET
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenwatermarkssettings.html#cfn-medialive-channel-nielsenwatermarkssettings-nielsencbetsettings
         */
        readonly nielsenCbetSettings?: CfnChannel.NielsenCBETProperty | cdk.IResolvable;
        /**
         * Choose the distribution types that you want to assign to the watermarks:
         * - PROGRAM_CONTENT
         * - FINAL_DISTRIBUTOR
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenwatermarkssettings.html#cfn-medialive-channel-nielsenwatermarkssettings-nielsendistributiontype
         */
        readonly nielsenDistributionType?: string;
        /**
         * Complete these fields only if you want to insert watermarks of type Nielsen NAES II (N2) and Nielsen NAES VI (NW).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-nielsenwatermarkssettings.html#cfn-medialive-channel-nielsenwatermarkssettings-nielsennaesiinwsettings
         */
        readonly nielsenNaesIiNwSettings?: CfnChannel.NielsenNaesIiNwProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `NielsenWatermarksSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `NielsenWatermarksSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_NielsenWatermarksSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nielsenCbetSettings', CfnChannel_NielsenCBETPropertyValidator)(properties.nielsenCbetSettings));
    errors.collect(cdk.propertyValidator('nielsenDistributionType', cdk.validateString)(properties.nielsenDistributionType));
    errors.collect(cdk.propertyValidator('nielsenNaesIiNwSettings', CfnChannel_NielsenNaesIiNwPropertyValidator)(properties.nielsenNaesIiNwSettings));
    return errors.wrap('supplied properties not correct for "NielsenWatermarksSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenWatermarksSettings` resource
 *
 * @param properties - the TypeScript properties of a `NielsenWatermarksSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.NielsenWatermarksSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelNielsenWatermarksSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_NielsenWatermarksSettingsPropertyValidator(properties).assertSuccess();
    return {
        NielsenCbetSettings: cfnChannelNielsenCBETPropertyToCloudFormation(properties.nielsenCbetSettings),
        NielsenDistributionType: cdk.stringToCloudFormation(properties.nielsenDistributionType),
        NielsenNaesIiNwSettings: cfnChannelNielsenNaesIiNwPropertyToCloudFormation(properties.nielsenNaesIiNwSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelNielsenWatermarksSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.NielsenWatermarksSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.NielsenWatermarksSettingsProperty>();
    ret.addPropertyResult('nielsenCbetSettings', 'NielsenCbetSettings', properties.NielsenCbetSettings != null ? CfnChannelNielsenCBETPropertyFromCloudFormation(properties.NielsenCbetSettings) : undefined);
    ret.addPropertyResult('nielsenDistributionType', 'NielsenDistributionType', properties.NielsenDistributionType != null ? cfn_parse.FromCloudFormation.getString(properties.NielsenDistributionType) : undefined);
    ret.addPropertyResult('nielsenNaesIiNwSettings', 'NielsenNaesIiNwSettings', properties.NielsenNaesIiNwSettings != null ? CfnChannelNielsenNaesIiNwPropertyFromCloudFormation(properties.NielsenNaesIiNwSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The output settings.
     *
     * The parent of this entity is OutputGroup.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html
     */
    export interface OutputProperty {
        /**
         * The names of the audio descriptions that are used as audio sources for this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html#cfn-medialive-channel-output-audiodescriptionnames
         */
        readonly audioDescriptionNames?: string[];
        /**
         * The names of the caption descriptions that are used as captions sources for this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html#cfn-medialive-channel-output-captiondescriptionnames
         */
        readonly captionDescriptionNames?: string[];
        /**
         * The name that is used to identify an output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html#cfn-medialive-channel-output-outputname
         */
        readonly outputName?: string;
        /**
         * The output type-specific settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html#cfn-medialive-channel-output-outputsettings
         */
        readonly outputSettings?: CfnChannel.OutputSettingsProperty | cdk.IResolvable;
        /**
         * The name of the VideoDescription that is used as the source for this output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-output.html#cfn-medialive-channel-output-videodescriptionname
         */
        readonly videoDescriptionName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputProperty`
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioDescriptionNames', cdk.listValidator(cdk.validateString))(properties.audioDescriptionNames));
    errors.collect(cdk.propertyValidator('captionDescriptionNames', cdk.listValidator(cdk.validateString))(properties.captionDescriptionNames));
    errors.collect(cdk.propertyValidator('outputName', cdk.validateString)(properties.outputName));
    errors.collect(cdk.propertyValidator('outputSettings', CfnChannel_OutputSettingsPropertyValidator)(properties.outputSettings));
    errors.collect(cdk.propertyValidator('videoDescriptionName', cdk.validateString)(properties.videoDescriptionName));
    return errors.wrap('supplied properties not correct for "OutputProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Output` resource
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Output` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputPropertyValidator(properties).assertSuccess();
    return {
        AudioDescriptionNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.audioDescriptionNames),
        CaptionDescriptionNames: cdk.listMapper(cdk.stringToCloudFormation)(properties.captionDescriptionNames),
        OutputName: cdk.stringToCloudFormation(properties.outputName),
        OutputSettings: cfnChannelOutputSettingsPropertyToCloudFormation(properties.outputSettings),
        VideoDescriptionName: cdk.stringToCloudFormation(properties.videoDescriptionName),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputProperty>();
    ret.addPropertyResult('audioDescriptionNames', 'AudioDescriptionNames', properties.AudioDescriptionNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AudioDescriptionNames) : undefined);
    ret.addPropertyResult('captionDescriptionNames', 'CaptionDescriptionNames', properties.CaptionDescriptionNames != null ? cfn_parse.FromCloudFormation.getStringArray(properties.CaptionDescriptionNames) : undefined);
    ret.addPropertyResult('outputName', 'OutputName', properties.OutputName != null ? cfn_parse.FromCloudFormation.getString(properties.OutputName) : undefined);
    ret.addPropertyResult('outputSettings', 'OutputSettings', properties.OutputSettings != null ? CfnChannelOutputSettingsPropertyFromCloudFormation(properties.OutputSettings) : undefined);
    ret.addPropertyResult('videoDescriptionName', 'VideoDescriptionName', properties.VideoDescriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.VideoDescriptionName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Configuration information for an output.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestination.html
     */
    export interface OutputDestinationProperty {
        /**
         * The ID for this destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestination.html#cfn-medialive-channel-outputdestination-id
         */
        readonly id?: string;
        /**
         * The destination settings for a MediaPackage output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestination.html#cfn-medialive-channel-outputdestination-mediapackagesettings
         */
        readonly mediaPackageSettings?: Array<CfnChannel.MediaPackageOutputDestinationSettingsProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Destination settings for a Multiplex output; one destination for both encoders.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestination.html#cfn-medialive-channel-outputdestination-multiplexsettings
         */
        readonly multiplexSettings?: CfnChannel.MultiplexProgramChannelDestinationSettingsProperty | cdk.IResolvable;
        /**
         * The destination settings for an output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestination.html#cfn-medialive-channel-outputdestination-settings
         */
        readonly settings?: Array<CfnChannel.OutputDestinationSettingsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OutputDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `OutputDestinationProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputDestinationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('mediaPackageSettings', cdk.listValidator(CfnChannel_MediaPackageOutputDestinationSettingsPropertyValidator))(properties.mediaPackageSettings));
    errors.collect(cdk.propertyValidator('multiplexSettings', CfnChannel_MultiplexProgramChannelDestinationSettingsPropertyValidator)(properties.multiplexSettings));
    errors.collect(cdk.propertyValidator('settings', cdk.listValidator(CfnChannel_OutputDestinationSettingsPropertyValidator))(properties.settings));
    return errors.wrap('supplied properties not correct for "OutputDestinationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputDestination` resource
 *
 * @param properties - the TypeScript properties of a `OutputDestinationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputDestination` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputDestinationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputDestinationPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        MediaPackageSettings: cdk.listMapper(cfnChannelMediaPackageOutputDestinationSettingsPropertyToCloudFormation)(properties.mediaPackageSettings),
        MultiplexSettings: cfnChannelMultiplexProgramChannelDestinationSettingsPropertyToCloudFormation(properties.multiplexSettings),
        Settings: cdk.listMapper(cfnChannelOutputDestinationSettingsPropertyToCloudFormation)(properties.settings),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputDestinationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputDestinationProperty>();
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('mediaPackageSettings', 'MediaPackageSettings', properties.MediaPackageSettings != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelMediaPackageOutputDestinationSettingsPropertyFromCloudFormation)(properties.MediaPackageSettings) : undefined);
    ret.addPropertyResult('multiplexSettings', 'MultiplexSettings', properties.MultiplexSettings != null ? CfnChannelMultiplexProgramChannelDestinationSettingsPropertyFromCloudFormation(properties.MultiplexSettings) : undefined);
    ret.addPropertyResult('settings', 'Settings', properties.Settings != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelOutputDestinationSettingsPropertyFromCloudFormation)(properties.Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration information for this output.
     *
     * The parent of this entity is OutputDestination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestinationsettings.html
     */
    export interface OutputDestinationSettingsProperty {
        /**
         * The password parameter that holds the password for accessing the downstream system. This password parameter applies only if the downstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestinationsettings.html#cfn-medialive-channel-outputdestinationsettings-passwordparam
         */
        readonly passwordParam?: string;
        /**
         * The stream name for the content. This applies only to RTMP outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestinationsettings.html#cfn-medialive-channel-outputdestinationsettings-streamname
         */
        readonly streamName?: string;
        /**
         * The URL for the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestinationsettings.html#cfn-medialive-channel-outputdestinationsettings-url
         */
        readonly url?: string;
        /**
         * The user name to connect to the downstream system. This applies only if the downstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputdestinationsettings.html#cfn-medialive-channel-outputdestinationsettings-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `OutputDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('passwordParam', cdk.validateString)(properties.passwordParam));
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "OutputDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `OutputDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        PasswordParam: cdk.stringToCloudFormation(properties.passwordParam),
        StreamName: cdk.stringToCloudFormation(properties.streamName),
        Url: cdk.stringToCloudFormation(properties.url),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputDestinationSettingsProperty>();
    ret.addPropertyResult('passwordParam', 'PasswordParam', properties.PasswordParam != null ? cfn_parse.FromCloudFormation.getString(properties.PasswordParam) : undefined);
    ret.addPropertyResult('streamName', 'StreamName', properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for one output group.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroup.html
     */
    export interface OutputGroupProperty {
        /**
         * A custom output group name that you can optionally define. Only letters, numbers, and the underscore character are allowed. The maximum length is 32 characters.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroup.html#cfn-medialive-channel-outputgroup-name
         */
        readonly name?: string;
        /**
         * The settings associated with the output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroup.html#cfn-medialive-channel-outputgroup-outputgroupsettings
         */
        readonly outputGroupSettings?: CfnChannel.OutputGroupSettingsProperty | cdk.IResolvable;
        /**
         * The settings for the outputs in the output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroup.html#cfn-medialive-channel-outputgroup-outputs
         */
        readonly outputs?: Array<CfnChannel.OutputProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OutputGroupProperty`
 *
 * @param properties - the TypeScript properties of a `OutputGroupProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputGroupPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('outputGroupSettings', CfnChannel_OutputGroupSettingsPropertyValidator)(properties.outputGroupSettings));
    errors.collect(cdk.propertyValidator('outputs', cdk.listValidator(CfnChannel_OutputPropertyValidator))(properties.outputs));
    return errors.wrap('supplied properties not correct for "OutputGroupProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputGroup` resource
 *
 * @param properties - the TypeScript properties of a `OutputGroupProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputGroup` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputGroupPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputGroupPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
        OutputGroupSettings: cfnChannelOutputGroupSettingsPropertyToCloudFormation(properties.outputGroupSettings),
        Outputs: cdk.listMapper(cfnChannelOutputPropertyToCloudFormation)(properties.outputs),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputGroupProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputGroupProperty>();
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('outputGroupSettings', 'OutputGroupSettings', properties.OutputGroupSettings != null ? CfnChannelOutputGroupSettingsPropertyFromCloudFormation(properties.OutputGroupSettings) : undefined);
    ret.addPropertyResult('outputs', 'Outputs', properties.Outputs != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelOutputPropertyFromCloudFormation)(properties.Outputs) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of the output group.
     *
     * The parent of this entity is OutputGroup.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html
     */
    export interface OutputGroupSettingsProperty {
        /**
         * The configuration of an archive output group.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-archivegroupsettings
         */
        readonly archiveGroupSettings?: CfnChannel.ArchiveGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of a frame capture output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-framecapturegroupsettings
         */
        readonly frameCaptureGroupSettings?: CfnChannel.FrameCaptureGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of an HLS output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-hlsgroupsettings
         */
        readonly hlsGroupSettings?: CfnChannel.HlsGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of a MediaPackage output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-mediapackagegroupsettings
         */
        readonly mediaPackageGroupSettings?: CfnChannel.MediaPackageGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of a Microsoft Smooth output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-mssmoothgroupsettings
         */
        readonly msSmoothGroupSettings?: CfnChannel.MsSmoothGroupSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a Multiplex output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-multiplexgroupsettings
         */
        readonly multiplexGroupSettings?: CfnChannel.MultiplexGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of an RTMP output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-rtmpgroupsettings
         */
        readonly rtmpGroupSettings?: CfnChannel.RtmpGroupSettingsProperty | cdk.IResolvable;
        /**
         * The configuration of a UDP output group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputgroupsettings.html#cfn-medialive-channel-outputgroupsettings-udpgroupsettings
         */
        readonly udpGroupSettings?: CfnChannel.UdpGroupSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OutputGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `OutputGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('archiveGroupSettings', CfnChannel_ArchiveGroupSettingsPropertyValidator)(properties.archiveGroupSettings));
    errors.collect(cdk.propertyValidator('frameCaptureGroupSettings', CfnChannel_FrameCaptureGroupSettingsPropertyValidator)(properties.frameCaptureGroupSettings));
    errors.collect(cdk.propertyValidator('hlsGroupSettings', CfnChannel_HlsGroupSettingsPropertyValidator)(properties.hlsGroupSettings));
    errors.collect(cdk.propertyValidator('mediaPackageGroupSettings', CfnChannel_MediaPackageGroupSettingsPropertyValidator)(properties.mediaPackageGroupSettings));
    errors.collect(cdk.propertyValidator('msSmoothGroupSettings', CfnChannel_MsSmoothGroupSettingsPropertyValidator)(properties.msSmoothGroupSettings));
    errors.collect(cdk.propertyValidator('multiplexGroupSettings', CfnChannel_MultiplexGroupSettingsPropertyValidator)(properties.multiplexGroupSettings));
    errors.collect(cdk.propertyValidator('rtmpGroupSettings', CfnChannel_RtmpGroupSettingsPropertyValidator)(properties.rtmpGroupSettings));
    errors.collect(cdk.propertyValidator('udpGroupSettings', CfnChannel_UdpGroupSettingsPropertyValidator)(properties.udpGroupSettings));
    return errors.wrap('supplied properties not correct for "OutputGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `OutputGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        ArchiveGroupSettings: cfnChannelArchiveGroupSettingsPropertyToCloudFormation(properties.archiveGroupSettings),
        FrameCaptureGroupSettings: cfnChannelFrameCaptureGroupSettingsPropertyToCloudFormation(properties.frameCaptureGroupSettings),
        HlsGroupSettings: cfnChannelHlsGroupSettingsPropertyToCloudFormation(properties.hlsGroupSettings),
        MediaPackageGroupSettings: cfnChannelMediaPackageGroupSettingsPropertyToCloudFormation(properties.mediaPackageGroupSettings),
        MsSmoothGroupSettings: cfnChannelMsSmoothGroupSettingsPropertyToCloudFormation(properties.msSmoothGroupSettings),
        MultiplexGroupSettings: cfnChannelMultiplexGroupSettingsPropertyToCloudFormation(properties.multiplexGroupSettings),
        RtmpGroupSettings: cfnChannelRtmpGroupSettingsPropertyToCloudFormation(properties.rtmpGroupSettings),
        UdpGroupSettings: cfnChannelUdpGroupSettingsPropertyToCloudFormation(properties.udpGroupSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputGroupSettingsProperty>();
    ret.addPropertyResult('archiveGroupSettings', 'ArchiveGroupSettings', properties.ArchiveGroupSettings != null ? CfnChannelArchiveGroupSettingsPropertyFromCloudFormation(properties.ArchiveGroupSettings) : undefined);
    ret.addPropertyResult('frameCaptureGroupSettings', 'FrameCaptureGroupSettings', properties.FrameCaptureGroupSettings != null ? CfnChannelFrameCaptureGroupSettingsPropertyFromCloudFormation(properties.FrameCaptureGroupSettings) : undefined);
    ret.addPropertyResult('hlsGroupSettings', 'HlsGroupSettings', properties.HlsGroupSettings != null ? CfnChannelHlsGroupSettingsPropertyFromCloudFormation(properties.HlsGroupSettings) : undefined);
    ret.addPropertyResult('mediaPackageGroupSettings', 'MediaPackageGroupSettings', properties.MediaPackageGroupSettings != null ? CfnChannelMediaPackageGroupSettingsPropertyFromCloudFormation(properties.MediaPackageGroupSettings) : undefined);
    ret.addPropertyResult('msSmoothGroupSettings', 'MsSmoothGroupSettings', properties.MsSmoothGroupSettings != null ? CfnChannelMsSmoothGroupSettingsPropertyFromCloudFormation(properties.MsSmoothGroupSettings) : undefined);
    ret.addPropertyResult('multiplexGroupSettings', 'MultiplexGroupSettings', properties.MultiplexGroupSettings != null ? CfnChannelMultiplexGroupSettingsPropertyFromCloudFormation(properties.MultiplexGroupSettings) : undefined);
    ret.addPropertyResult('rtmpGroupSettings', 'RtmpGroupSettings', properties.RtmpGroupSettings != null ? CfnChannelRtmpGroupSettingsPropertyFromCloudFormation(properties.RtmpGroupSettings) : undefined);
    ret.addPropertyResult('udpGroupSettings', 'UdpGroupSettings', properties.UdpGroupSettings != null ? CfnChannelUdpGroupSettingsPropertyFromCloudFormation(properties.UdpGroupSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * A reference to an OutputDestination ID that is defined in the channel.
     *
     * This entity is used by ArchiveGroupSettings, FrameCaptureGroupSettings, HlsGroupSettings, MediaPackageGroupSettings, MSSmoothGroupSettings, RtmpOutputSettings, and UdpOutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputlocationref.html
     */
    export interface OutputLocationRefProperty {
        /**
         * A reference ID for this destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputlocationref.html#cfn-medialive-channel-outputlocationref-destinationrefid
         */
        readonly destinationRefId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OutputLocationRefProperty`
 *
 * @param properties - the TypeScript properties of a `OutputLocationRefProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputLocationRefPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinationRefId', cdk.validateString)(properties.destinationRefId));
    return errors.wrap('supplied properties not correct for "OutputLocationRefProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputLocationRef` resource
 *
 * @param properties - the TypeScript properties of a `OutputLocationRefProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputLocationRef` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputLocationRefPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputLocationRefPropertyValidator(properties).assertSuccess();
    return {
        DestinationRefId: cdk.stringToCloudFormation(properties.destinationRefId),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputLocationRefPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputLocationRefProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputLocationRefProperty>();
    ret.addPropertyResult('destinationRefId', 'DestinationRefId', properties.DestinationRefId != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationRefId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The output settings.
     *
     * The parent of this entity is Output.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html
     */
    export interface OutputSettingsProperty {
        /**
         * The settings for an archive output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-archiveoutputsettings
         */
        readonly archiveOutputSettings?: CfnChannel.ArchiveOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a frame capture output.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-framecaptureoutputsettings
         */
        readonly frameCaptureOutputSettings?: CfnChannel.FrameCaptureOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for an HLS output.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-hlsoutputsettings
         */
        readonly hlsOutputSettings?: CfnChannel.HlsOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a MediaPackage output.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-mediapackageoutputsettings
         */
        readonly mediaPackageOutputSettings?: CfnChannel.MediaPackageOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a Microsoft Smooth output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-mssmoothoutputsettings
         */
        readonly msSmoothOutputSettings?: CfnChannel.MsSmoothOutputSettingsProperty | cdk.IResolvable;
        /**
         * Configuration of a Multiplex output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-multiplexoutputsettings
         */
        readonly multiplexOutputSettings?: CfnChannel.MultiplexOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for an RTMP output.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-rtmpoutputsettings
         */
        readonly rtmpOutputSettings?: CfnChannel.RtmpOutputSettingsProperty | cdk.IResolvable;
        /**
         * The settings for a UDP output.
         *
         * The parent of this entity is OutputGroupSettings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputsettings.html#cfn-medialive-channel-outputsettings-udpoutputsettings
         */
        readonly udpOutputSettings?: CfnChannel.UdpOutputSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `OutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `OutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_OutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('archiveOutputSettings', CfnChannel_ArchiveOutputSettingsPropertyValidator)(properties.archiveOutputSettings));
    errors.collect(cdk.propertyValidator('frameCaptureOutputSettings', CfnChannel_FrameCaptureOutputSettingsPropertyValidator)(properties.frameCaptureOutputSettings));
    errors.collect(cdk.propertyValidator('hlsOutputSettings', CfnChannel_HlsOutputSettingsPropertyValidator)(properties.hlsOutputSettings));
    errors.collect(cdk.propertyValidator('mediaPackageOutputSettings', CfnChannel_MediaPackageOutputSettingsPropertyValidator)(properties.mediaPackageOutputSettings));
    errors.collect(cdk.propertyValidator('msSmoothOutputSettings', CfnChannel_MsSmoothOutputSettingsPropertyValidator)(properties.msSmoothOutputSettings));
    errors.collect(cdk.propertyValidator('multiplexOutputSettings', CfnChannel_MultiplexOutputSettingsPropertyValidator)(properties.multiplexOutputSettings));
    errors.collect(cdk.propertyValidator('rtmpOutputSettings', CfnChannel_RtmpOutputSettingsPropertyValidator)(properties.rtmpOutputSettings));
    errors.collect(cdk.propertyValidator('udpOutputSettings', CfnChannel_UdpOutputSettingsPropertyValidator)(properties.udpOutputSettings));
    return errors.wrap('supplied properties not correct for "OutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `OutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.OutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_OutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        ArchiveOutputSettings: cfnChannelArchiveOutputSettingsPropertyToCloudFormation(properties.archiveOutputSettings),
        FrameCaptureOutputSettings: cfnChannelFrameCaptureOutputSettingsPropertyToCloudFormation(properties.frameCaptureOutputSettings),
        HlsOutputSettings: cfnChannelHlsOutputSettingsPropertyToCloudFormation(properties.hlsOutputSettings),
        MediaPackageOutputSettings: cfnChannelMediaPackageOutputSettingsPropertyToCloudFormation(properties.mediaPackageOutputSettings),
        MsSmoothOutputSettings: cfnChannelMsSmoothOutputSettingsPropertyToCloudFormation(properties.msSmoothOutputSettings),
        MultiplexOutputSettings: cfnChannelMultiplexOutputSettingsPropertyToCloudFormation(properties.multiplexOutputSettings),
        RtmpOutputSettings: cfnChannelRtmpOutputSettingsPropertyToCloudFormation(properties.rtmpOutputSettings),
        UdpOutputSettings: cfnChannelUdpOutputSettingsPropertyToCloudFormation(properties.udpOutputSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.OutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.OutputSettingsProperty>();
    ret.addPropertyResult('archiveOutputSettings', 'ArchiveOutputSettings', properties.ArchiveOutputSettings != null ? CfnChannelArchiveOutputSettingsPropertyFromCloudFormation(properties.ArchiveOutputSettings) : undefined);
    ret.addPropertyResult('frameCaptureOutputSettings', 'FrameCaptureOutputSettings', properties.FrameCaptureOutputSettings != null ? CfnChannelFrameCaptureOutputSettingsPropertyFromCloudFormation(properties.FrameCaptureOutputSettings) : undefined);
    ret.addPropertyResult('hlsOutputSettings', 'HlsOutputSettings', properties.HlsOutputSettings != null ? CfnChannelHlsOutputSettingsPropertyFromCloudFormation(properties.HlsOutputSettings) : undefined);
    ret.addPropertyResult('mediaPackageOutputSettings', 'MediaPackageOutputSettings', properties.MediaPackageOutputSettings != null ? CfnChannelMediaPackageOutputSettingsPropertyFromCloudFormation(properties.MediaPackageOutputSettings) : undefined);
    ret.addPropertyResult('msSmoothOutputSettings', 'MsSmoothOutputSettings', properties.MsSmoothOutputSettings != null ? CfnChannelMsSmoothOutputSettingsPropertyFromCloudFormation(properties.MsSmoothOutputSettings) : undefined);
    ret.addPropertyResult('multiplexOutputSettings', 'MultiplexOutputSettings', properties.MultiplexOutputSettings != null ? CfnChannelMultiplexOutputSettingsPropertyFromCloudFormation(properties.MultiplexOutputSettings) : undefined);
    ret.addPropertyResult('rtmpOutputSettings', 'RtmpOutputSettings', properties.RtmpOutputSettings != null ? CfnChannelRtmpOutputSettingsPropertyFromCloudFormation(properties.RtmpOutputSettings) : undefined);
    ret.addPropertyResult('udpOutputSettings', 'UdpOutputSettings', properties.UdpOutputSettings != null ? CfnChannelUdpOutputSettingsPropertyFromCloudFormation(properties.UdpOutputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for passing through audio to the output.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-passthroughsettings.html
     */
    export interface PassThroughSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `PassThroughSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `PassThroughSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_PassThroughSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "PassThroughSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.PassThroughSettings` resource
 *
 * @param properties - the TypeScript properties of a `PassThroughSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.PassThroughSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelPassThroughSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_PassThroughSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelPassThroughSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.PassThroughSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.PassThroughSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The container for WAV audio in the output group.
     *
     * The parent of this entity is ArchiveContainerSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rawsettings.html
     */
    export interface RawSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `RawSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RawSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RawSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "RawSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RawSettings` resource
 *
 * @param properties - the TypeScript properties of a `RawSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RawSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRawSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RawSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelRawSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RawSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RawSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Rec601 Settings
     *
     * The parents of this entity are H264ColorSpaceSettings and H265ColorSpaceSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rec601settings.html
     */
    export interface Rec601SettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `Rec601SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Rec601SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Rec601SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "Rec601SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Rec601Settings` resource
 *
 * @param properties - the TypeScript properties of a `Rec601SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Rec601Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRec601SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Rec601SettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelRec601SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Rec601SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Rec601SettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Rec709 Settings
     *
     * The parents of this entity are H264ColorSpaceSettings and H265ColorSpaceSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rec709settings.html
     */
    export interface Rec709SettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `Rec709SettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Rec709SettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Rec709SettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "Rec709SettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Rec709Settings` resource
 *
 * @param properties - the TypeScript properties of a `Rec709SettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Rec709Settings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRec709SettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Rec709SettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelRec709SettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Rec709SettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Rec709SettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for remixing audio in the output.
     *
     * The parent of this entity is AudioDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-remixsettings.html
     */
    export interface RemixSettingsProperty {
        /**
         * A mapping of input channels to output channels, with appropriate gain adjustments.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-remixsettings.html#cfn-medialive-channel-remixsettings-channelmappings
         */
        readonly channelMappings?: Array<CfnChannel.AudioChannelMappingProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The number of input channels to be used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-remixsettings.html#cfn-medialive-channel-remixsettings-channelsin
         */
        readonly channelsIn?: number;
        /**
         * The number of output channels to be produced. Valid values: 1, 2, 4, 6, 8.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-remixsettings.html#cfn-medialive-channel-remixsettings-channelsout
         */
        readonly channelsOut?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RemixSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RemixSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RemixSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelMappings', cdk.listValidator(CfnChannel_AudioChannelMappingPropertyValidator))(properties.channelMappings));
    errors.collect(cdk.propertyValidator('channelsIn', cdk.validateNumber)(properties.channelsIn));
    errors.collect(cdk.propertyValidator('channelsOut', cdk.validateNumber)(properties.channelsOut));
    return errors.wrap('supplied properties not correct for "RemixSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RemixSettings` resource
 *
 * @param properties - the TypeScript properties of a `RemixSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RemixSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRemixSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RemixSettingsPropertyValidator(properties).assertSuccess();
    return {
        ChannelMappings: cdk.listMapper(cfnChannelAudioChannelMappingPropertyToCloudFormation)(properties.channelMappings),
        ChannelsIn: cdk.numberToCloudFormation(properties.channelsIn),
        ChannelsOut: cdk.numberToCloudFormation(properties.channelsOut),
    };
}

// @ts-ignore TS6133
function CfnChannelRemixSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RemixSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RemixSettingsProperty>();
    ret.addPropertyResult('channelMappings', 'ChannelMappings', properties.ChannelMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelAudioChannelMappingPropertyFromCloudFormation)(properties.ChannelMappings) : undefined);
    ret.addPropertyResult('channelsIn', 'ChannelsIn', properties.ChannelsIn != null ? cfn_parse.FromCloudFormation.getNumber(properties.ChannelsIn) : undefined);
    ret.addPropertyResult('channelsOut', 'ChannelsOut', properties.ChannelsOut != null ? cfn_parse.FromCloudFormation.getNumber(properties.ChannelsOut) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for RTMPCaptionInfo captions encode in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpcaptioninfodestinationsettings.html
     */
    export interface RtmpCaptionInfoDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `RtmpCaptionInfoDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RtmpCaptionInfoDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RtmpCaptionInfoDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "RtmpCaptionInfoDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpCaptionInfoDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `RtmpCaptionInfoDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpCaptionInfoDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRtmpCaptionInfoDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RtmpCaptionInfoDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelRtmpCaptionInfoDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RtmpCaptionInfoDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RtmpCaptionInfoDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of an RTMP output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html
     */
    export interface RtmpGroupSettingsProperty {
        /**
         * Choose the ad marker type for this output group. MediaLive will create a message based on the content of each SCTE-35 message, format it for that marker type, and insert it in the datastream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-admarkers
         */
        readonly adMarkers?: string[];
        /**
         * An authentication scheme to use when connecting with a CDN.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-authenticationscheme
         */
        readonly authenticationScheme?: string;
        /**
         * Controls behavior when the content cache fills up. If a remote origin server stalls the RTMP connection and doesn't accept content fast enough, the media cache fills up. When the cache reaches the duration specified by cacheLength, the cache stops accepting new content. If set to disconnectImmediately, the RTMP output forces a disconnect. Clear the media cache, and reconnect after restartDelay seconds. If set to waitForServer, the RTMP output waits up to 5 minutes to allow the origin server to begin accepting data again.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-cachefullbehavior
         */
        readonly cacheFullBehavior?: string;
        /**
         * The cache length, in seconds, that is used to calculate buffer size.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-cachelength
         */
        readonly cacheLength?: number;
        /**
         * Controls the types of data that pass to onCaptionInfo outputs. If set to all, 608 and 708 carried DTVCC data is passed. If set to field1AndField2608, DTVCC data is stripped out, but 608 data from both fields is passed. If set to field1608, only the data carried in 608 from field 1 video is passed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-captiondata
         */
        readonly captionData?: string;
        /**
         * Controls the behavior of this RTMP group if the input becomes unavailable. emitOutput: Emit a slate until the input returns. pauseOutput: Stop transmitting data until the input returns. This does not close the underlying RTMP connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-inputlossaction
         */
        readonly inputLossAction?: string;
        /**
         * If a streaming output fails, the number of seconds to wait until a restart is initiated. A value of 0 means never restart.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpgroupsettings.html#cfn-medialive-channel-rtmpgroupsettings-restartdelay
         */
        readonly restartDelay?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RtmpGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RtmpGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RtmpGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adMarkers', cdk.listValidator(cdk.validateString))(properties.adMarkers));
    errors.collect(cdk.propertyValidator('authenticationScheme', cdk.validateString)(properties.authenticationScheme));
    errors.collect(cdk.propertyValidator('cacheFullBehavior', cdk.validateString)(properties.cacheFullBehavior));
    errors.collect(cdk.propertyValidator('cacheLength', cdk.validateNumber)(properties.cacheLength));
    errors.collect(cdk.propertyValidator('captionData', cdk.validateString)(properties.captionData));
    errors.collect(cdk.propertyValidator('inputLossAction', cdk.validateString)(properties.inputLossAction));
    errors.collect(cdk.propertyValidator('restartDelay', cdk.validateNumber)(properties.restartDelay));
    return errors.wrap('supplied properties not correct for "RtmpGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `RtmpGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRtmpGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RtmpGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        AdMarkers: cdk.listMapper(cdk.stringToCloudFormation)(properties.adMarkers),
        AuthenticationScheme: cdk.stringToCloudFormation(properties.authenticationScheme),
        CacheFullBehavior: cdk.stringToCloudFormation(properties.cacheFullBehavior),
        CacheLength: cdk.numberToCloudFormation(properties.cacheLength),
        CaptionData: cdk.stringToCloudFormation(properties.captionData),
        InputLossAction: cdk.stringToCloudFormation(properties.inputLossAction),
        RestartDelay: cdk.numberToCloudFormation(properties.restartDelay),
    };
}

// @ts-ignore TS6133
function CfnChannelRtmpGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RtmpGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RtmpGroupSettingsProperty>();
    ret.addPropertyResult('adMarkers', 'AdMarkers', properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AdMarkers) : undefined);
    ret.addPropertyResult('authenticationScheme', 'AuthenticationScheme', properties.AuthenticationScheme != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationScheme) : undefined);
    ret.addPropertyResult('cacheFullBehavior', 'CacheFullBehavior', properties.CacheFullBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.CacheFullBehavior) : undefined);
    ret.addPropertyResult('cacheLength', 'CacheLength', properties.CacheLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.CacheLength) : undefined);
    ret.addPropertyResult('captionData', 'CaptionData', properties.CaptionData != null ? cfn_parse.FromCloudFormation.getString(properties.CaptionData) : undefined);
    ret.addPropertyResult('inputLossAction', 'InputLossAction', properties.InputLossAction != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossAction) : undefined);
    ret.addPropertyResult('restartDelay', 'RestartDelay', properties.RestartDelay != null ? cfn_parse.FromCloudFormation.getNumber(properties.RestartDelay) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for one RTMP output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpoutputsettings.html
     */
    export interface RtmpOutputSettingsProperty {
        /**
         * If set to verifyAuthenticity, verifies the TLS certificate chain to a trusted certificate authority (CA). This causes RTMPS outputs with self-signed certificates to fail.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpoutputsettings.html#cfn-medialive-channel-rtmpoutputsettings-certificatemode
         */
        readonly certificateMode?: string;
        /**
         * The number of seconds to wait before retrying a connection to the Flash Media server if the connection is lost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpoutputsettings.html#cfn-medialive-channel-rtmpoutputsettings-connectionretryinterval
         */
        readonly connectionRetryInterval?: number;
        /**
         * The RTMP endpoint excluding the stream name (for example, rtmp://host/appname).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpoutputsettings.html#cfn-medialive-channel-rtmpoutputsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * The number of retry attempts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-rtmpoutputsettings.html#cfn-medialive-channel-rtmpoutputsettings-numretries
         */
        readonly numRetries?: number;
    }
}

/**
 * Determine whether the given properties match those of a `RtmpOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RtmpOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_RtmpOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateMode', cdk.validateString)(properties.certificateMode));
    errors.collect(cdk.propertyValidator('connectionRetryInterval', cdk.validateNumber)(properties.connectionRetryInterval));
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('numRetries', cdk.validateNumber)(properties.numRetries));
    return errors.wrap('supplied properties not correct for "RtmpOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `RtmpOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.RtmpOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelRtmpOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_RtmpOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        CertificateMode: cdk.stringToCloudFormation(properties.certificateMode),
        ConnectionRetryInterval: cdk.numberToCloudFormation(properties.connectionRetryInterval),
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        NumRetries: cdk.numberToCloudFormation(properties.numRetries),
    };
}

// @ts-ignore TS6133
function CfnChannelRtmpOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.RtmpOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RtmpOutputSettingsProperty>();
    ret.addPropertyResult('certificateMode', 'CertificateMode', properties.CertificateMode != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateMode) : undefined);
    ret.addPropertyResult('connectionRetryInterval', 'ConnectionRetryInterval', properties.ConnectionRetryInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.ConnectionRetryInterval) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('numRetries', 'NumRetries', properties.NumRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumRetries) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of SCTE-20 plus embedded captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte20plusembeddeddestinationsettings.html
     */
    export interface Scte20PlusEmbeddedDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `Scte20PlusEmbeddedDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Scte20PlusEmbeddedDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte20PlusEmbeddedDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "Scte20PlusEmbeddedDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte20PlusEmbeddedDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `Scte20PlusEmbeddedDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte20PlusEmbeddedDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte20PlusEmbeddedDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte20PlusEmbeddedDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelScte20PlusEmbeddedDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte20PlusEmbeddedDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte20PlusEmbeddedDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the SCTE-20 captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte20sourcesettings.html
     */
    export interface Scte20SourceSettingsProperty {
        /**
         * If upconvert, 608 data is both passed through the "608 compatibility bytes" fields of the 708 wrapper as well as translated into 708. Any 708 data present in the source content is discarded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte20sourcesettings.html#cfn-medialive-channel-scte20sourcesettings-convert608to708
         */
        readonly convert608To708?: string;
        /**
         * Specifies the 608/708 channel number within the video track from which to extract captions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte20sourcesettings.html#cfn-medialive-channel-scte20sourcesettings-source608channelnumber
         */
        readonly source608ChannelNumber?: number;
    }
}

/**
 * Determine whether the given properties match those of a `Scte20SourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Scte20SourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte20SourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('convert608To708', cdk.validateString)(properties.convert608To708));
    errors.collect(cdk.propertyValidator('source608ChannelNumber', cdk.validateNumber)(properties.source608ChannelNumber));
    return errors.wrap('supplied properties not correct for "Scte20SourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte20SourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `Scte20SourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte20SourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte20SourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte20SourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        Convert608To708: cdk.stringToCloudFormation(properties.convert608To708),
        Source608ChannelNumber: cdk.numberToCloudFormation(properties.source608ChannelNumber),
    };
}

// @ts-ignore TS6133
function CfnChannelScte20SourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte20SourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte20SourceSettingsProperty>();
    ret.addPropertyResult('convert608To708', 'Convert608To708', properties.Convert608To708 != null ? cfn_parse.FromCloudFormation.getString(properties.Convert608To708) : undefined);
    ret.addPropertyResult('source608ChannelNumber', 'Source608ChannelNumber', properties.Source608ChannelNumber != null ? cfn_parse.FromCloudFormation.getNumber(properties.Source608ChannelNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of SCTE-27 captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte27destinationsettings.html
     */
    export interface Scte27DestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `Scte27DestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Scte27DestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte27DestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "Scte27DestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte27DestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `Scte27DestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte27DestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte27DestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte27DestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelScte27DestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte27DestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte27DestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the SCTE-27 captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte27sourcesettings.html
     */
    export interface Scte27SourceSettingsProperty {
        /**
         * If you will configure a WebVTT caption description that references this caption selector, use this field to
         * provide the language to consider when translating the image-based source to text.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte27sourcesettings.html#cfn-medialive-channel-scte27sourcesettings-ocrlanguage
         */
        readonly ocrLanguage?: string;
        /**
         * The PID field is used in conjunction with the captions selector languageCode field as follows: Specify PID and Language: Extracts captions from that PID; the language is "informational." Specify PID and omit Language: Extracts the specified PID. Omit PID and specify Language: Extracts the specified language, whichever PID that happens to be. Omit PID and omit Language: Valid only if source is DVB-Sub that is being passed through; all languages are passed through.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte27sourcesettings.html#cfn-medialive-channel-scte27sourcesettings-pid
         */
        readonly pid?: number;
    }
}

/**
 * Determine whether the given properties match those of a `Scte27SourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `Scte27SourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte27SourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ocrLanguage', cdk.validateString)(properties.ocrLanguage));
    errors.collect(cdk.propertyValidator('pid', cdk.validateNumber)(properties.pid));
    return errors.wrap('supplied properties not correct for "Scte27SourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte27SourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `Scte27SourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte27SourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte27SourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte27SourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        OcrLanguage: cdk.stringToCloudFormation(properties.ocrLanguage),
        Pid: cdk.numberToCloudFormation(properties.pid),
    };
}

// @ts-ignore TS6133
function CfnChannelScte27SourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte27SourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte27SourceSettingsProperty>();
    ret.addPropertyResult('ocrLanguage', 'OcrLanguage', properties.OcrLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.OcrLanguage) : undefined);
    ret.addPropertyResult('pid', 'Pid', properties.Pid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Pid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setup of SCTE-35 splice insert handling.
     *
     * The parent of this entity is AvailSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35spliceinsert.html
     */
    export interface Scte35SpliceInsertProperty {
        /**
         * When specified, this offset (in milliseconds) is added to the input ad avail PTS time. This applies only to embedded SCTE 104/35 messages. It doesn't apply to OOB messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35spliceinsert.html#cfn-medialive-channel-scte35spliceinsert-adavailoffset
         */
        readonly adAvailOffset?: number;
        /**
         * When set to ignore, segment descriptors with noRegionalBlackoutFlag set to 0 no longer trigger blackouts or ad avail slates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35spliceinsert.html#cfn-medialive-channel-scte35spliceinsert-noregionalblackoutflag
         */
        readonly noRegionalBlackoutFlag?: string;
        /**
         * When set to ignore, segment descriptors with webDeliveryAllowedFlag set to 0 no longer trigger blackouts or ad avail slates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35spliceinsert.html#cfn-medialive-channel-scte35spliceinsert-webdeliveryallowedflag
         */
        readonly webDeliveryAllowedFlag?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Scte35SpliceInsertProperty`
 *
 * @param properties - the TypeScript properties of a `Scte35SpliceInsertProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte35SpliceInsertPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adAvailOffset', cdk.validateNumber)(properties.adAvailOffset));
    errors.collect(cdk.propertyValidator('noRegionalBlackoutFlag', cdk.validateString)(properties.noRegionalBlackoutFlag));
    errors.collect(cdk.propertyValidator('webDeliveryAllowedFlag', cdk.validateString)(properties.webDeliveryAllowedFlag));
    return errors.wrap('supplied properties not correct for "Scte35SpliceInsertProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte35SpliceInsert` resource
 *
 * @param properties - the TypeScript properties of a `Scte35SpliceInsertProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte35SpliceInsert` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte35SpliceInsertPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte35SpliceInsertPropertyValidator(properties).assertSuccess();
    return {
        AdAvailOffset: cdk.numberToCloudFormation(properties.adAvailOffset),
        NoRegionalBlackoutFlag: cdk.stringToCloudFormation(properties.noRegionalBlackoutFlag),
        WebDeliveryAllowedFlag: cdk.stringToCloudFormation(properties.webDeliveryAllowedFlag),
    };
}

// @ts-ignore TS6133
function CfnChannelScte35SpliceInsertPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte35SpliceInsertProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte35SpliceInsertProperty>();
    ret.addPropertyResult('adAvailOffset', 'AdAvailOffset', properties.AdAvailOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.AdAvailOffset) : undefined);
    ret.addPropertyResult('noRegionalBlackoutFlag', 'NoRegionalBlackoutFlag', properties.NoRegionalBlackoutFlag != null ? cfn_parse.FromCloudFormation.getString(properties.NoRegionalBlackoutFlag) : undefined);
    ret.addPropertyResult('webDeliveryAllowedFlag', 'WebDeliveryAllowedFlag', properties.WebDeliveryAllowedFlag != null ? cfn_parse.FromCloudFormation.getString(properties.WebDeliveryAllowedFlag) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the SCTE-35 time signal APOS mode.
     *
     * The parent of this entity is AvailSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35timesignalapos.html
     */
    export interface Scte35TimeSignalAposProperty {
        /**
         * When specified, this offset (in milliseconds) is added to the input ad avail PTS time. This applies only to embedded SCTE 104/35 messages. It doesn't apply to OOB messages.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35timesignalapos.html#cfn-medialive-channel-scte35timesignalapos-adavailoffset
         */
        readonly adAvailOffset?: number;
        /**
         * When set to ignore, segment descriptors with noRegionalBlackoutFlag set to 0 no longer trigger blackouts or ad avail slates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35timesignalapos.html#cfn-medialive-channel-scte35timesignalapos-noregionalblackoutflag
         */
        readonly noRegionalBlackoutFlag?: string;
        /**
         * When set to ignore, segment descriptors with webDeliveryAllowedFlag set to 0 no longer trigger blackouts or ad avail slates.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-scte35timesignalapos.html#cfn-medialive-channel-scte35timesignalapos-webdeliveryallowedflag
         */
        readonly webDeliveryAllowedFlag?: string;
    }
}

/**
 * Determine whether the given properties match those of a `Scte35TimeSignalAposProperty`
 *
 * @param properties - the TypeScript properties of a `Scte35TimeSignalAposProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_Scte35TimeSignalAposPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('adAvailOffset', cdk.validateNumber)(properties.adAvailOffset));
    errors.collect(cdk.propertyValidator('noRegionalBlackoutFlag', cdk.validateString)(properties.noRegionalBlackoutFlag));
    errors.collect(cdk.propertyValidator('webDeliveryAllowedFlag', cdk.validateString)(properties.webDeliveryAllowedFlag));
    return errors.wrap('supplied properties not correct for "Scte35TimeSignalAposProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte35TimeSignalApos` resource
 *
 * @param properties - the TypeScript properties of a `Scte35TimeSignalAposProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.Scte35TimeSignalApos` resource.
 */
// @ts-ignore TS6133
function cfnChannelScte35TimeSignalAposPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_Scte35TimeSignalAposPropertyValidator(properties).assertSuccess();
    return {
        AdAvailOffset: cdk.numberToCloudFormation(properties.adAvailOffset),
        NoRegionalBlackoutFlag: cdk.stringToCloudFormation(properties.noRegionalBlackoutFlag),
        WebDeliveryAllowedFlag: cdk.stringToCloudFormation(properties.webDeliveryAllowedFlag),
    };
}

// @ts-ignore TS6133
function CfnChannelScte35TimeSignalAposPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.Scte35TimeSignalAposProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.Scte35TimeSignalAposProperty>();
    ret.addPropertyResult('adAvailOffset', 'AdAvailOffset', properties.AdAvailOffset != null ? cfn_parse.FromCloudFormation.getNumber(properties.AdAvailOffset) : undefined);
    ret.addPropertyResult('noRegionalBlackoutFlag', 'NoRegionalBlackoutFlag', properties.NoRegionalBlackoutFlag != null ? cfn_parse.FromCloudFormation.getString(properties.NoRegionalBlackoutFlag) : undefined);
    ret.addPropertyResult('webDeliveryAllowedFlag', 'WebDeliveryAllowedFlag', properties.WebDeliveryAllowedFlag != null ? cfn_parse.FromCloudFormation.getString(properties.WebDeliveryAllowedFlag) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setup of SMPTE-TT captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-smptettdestinationsettings.html
     */
    export interface SmpteTtDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `SmpteTtDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `SmpteTtDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_SmpteTtDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "SmpteTtDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.SmpteTtDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `SmpteTtDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.SmpteTtDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelSmpteTtDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_SmpteTtDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelSmpteTtDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.SmpteTtDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.SmpteTtDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of an HLS output that is a standard output (not an audio-only output).
     *
     * The parent of this entity is HlsSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-standardhlssettings.html
     */
    export interface StandardHlsSettingsProperty {
        /**
         * Lists all the audio groups that are used with the video output stream. This inputs all the audio GROUP-IDs that are associated with the video, separated by a comma (,).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-standardhlssettings.html#cfn-medialive-channel-standardhlssettings-audiorenditionsets
         */
        readonly audioRenditionSets?: string;
        /**
         * Settings for the M3U8 container.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-standardhlssettings.html#cfn-medialive-channel-standardhlssettings-m3u8settings
         */
        readonly m3U8Settings?: CfnChannel.M3u8SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `StandardHlsSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `StandardHlsSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_StandardHlsSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('audioRenditionSets', cdk.validateString)(properties.audioRenditionSets));
    errors.collect(cdk.propertyValidator('m3U8Settings', CfnChannel_M3u8SettingsPropertyValidator)(properties.m3U8Settings));
    return errors.wrap('supplied properties not correct for "StandardHlsSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.StandardHlsSettings` resource
 *
 * @param properties - the TypeScript properties of a `StandardHlsSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.StandardHlsSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelStandardHlsSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_StandardHlsSettingsPropertyValidator(properties).assertSuccess();
    return {
        AudioRenditionSets: cdk.stringToCloudFormation(properties.audioRenditionSets),
        M3u8Settings: cfnChannelM3u8SettingsPropertyToCloudFormation(properties.m3U8Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelStandardHlsSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.StandardHlsSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.StandardHlsSettingsProperty>();
    ret.addPropertyResult('audioRenditionSets', 'AudioRenditionSets', properties.AudioRenditionSets != null ? cfn_parse.FromCloudFormation.getString(properties.AudioRenditionSets) : undefined);
    ret.addPropertyResult('m3U8Settings', 'M3u8Settings', properties.M3u8Settings != null ? CfnChannelM3u8SettingsPropertyFromCloudFormation(properties.M3u8Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The static key settings.
     *
     * The parent of this entity is KeyProviderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-statickeysettings.html
     */
    export interface StaticKeySettingsProperty {
        /**
         * The URL of the license server that is used for protecting content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-statickeysettings.html#cfn-medialive-channel-statickeysettings-keyproviderserver
         */
        readonly keyProviderServer?: CfnChannel.InputLocationProperty | cdk.IResolvable;
        /**
         * The static key value as a 32 character hexadecimal string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-statickeysettings.html#cfn-medialive-channel-statickeysettings-statickeyvalue
         */
        readonly staticKeyValue?: string;
    }
}

/**
 * Determine whether the given properties match those of a `StaticKeySettingsProperty`
 *
 * @param properties - the TypeScript properties of a `StaticKeySettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_StaticKeySettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyProviderServer', CfnChannel_InputLocationPropertyValidator)(properties.keyProviderServer));
    errors.collect(cdk.propertyValidator('staticKeyValue', cdk.validateString)(properties.staticKeyValue));
    return errors.wrap('supplied properties not correct for "StaticKeySettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.StaticKeySettings` resource
 *
 * @param properties - the TypeScript properties of a `StaticKeySettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.StaticKeySettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelStaticKeySettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_StaticKeySettingsPropertyValidator(properties).assertSuccess();
    return {
        KeyProviderServer: cfnChannelInputLocationPropertyToCloudFormation(properties.keyProviderServer),
        StaticKeyValue: cdk.stringToCloudFormation(properties.staticKeyValue),
    };
}

// @ts-ignore TS6133
function CfnChannelStaticKeySettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.StaticKeySettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.StaticKeySettingsProperty>();
    ret.addPropertyResult('keyProviderServer', 'KeyProviderServer', properties.KeyProviderServer != null ? CfnChannelInputLocationPropertyFromCloudFormation(properties.KeyProviderServer) : undefined);
    ret.addPropertyResult('staticKeyValue', 'StaticKeyValue', properties.StaticKeyValue != null ? cfn_parse.FromCloudFormation.getString(properties.StaticKeyValue) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for a Teletext captions output encode.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-teletextdestinationsettings.html
     */
    export interface TeletextDestinationSettingsProperty {
    }
}

/**
 * Determine whether the given properties match those of a `TeletextDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TeletextDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_TeletextDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    return errors.wrap('supplied properties not correct for "TeletextDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TeletextDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `TeletextDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TeletextDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelTeletextDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_TeletextDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
    };
}

// @ts-ignore TS6133
function CfnChannelTeletextDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.TeletextDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TeletextDestinationSettingsProperty>();
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the Teletext captions to extract from the input.
     *
     * The parent of this entity is CaptionSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-teletextsourcesettings.html
     */
    export interface TeletextSourceSettingsProperty {
        /**
         * Settings to configure the caption rectangle for an output captions that will be created using this Teletext source captions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-teletextsourcesettings.html#cfn-medialive-channel-teletextsourcesettings-outputrectangle
         */
        readonly outputRectangle?: CfnChannel.CaptionRectangleProperty | cdk.IResolvable;
        /**
         * Specifies the Teletext page number within the data stream from which to extract captions. The range is 0x100 (256) to 0x8FF (2303). This is unused for passthrough. It should be specified as a hexadecimal string with no "0x" prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-teletextsourcesettings.html#cfn-medialive-channel-teletextsourcesettings-pagenumber
         */
        readonly pageNumber?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TeletextSourceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TeletextSourceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_TeletextSourceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('outputRectangle', CfnChannel_CaptionRectanglePropertyValidator)(properties.outputRectangle));
    errors.collect(cdk.propertyValidator('pageNumber', cdk.validateString)(properties.pageNumber));
    return errors.wrap('supplied properties not correct for "TeletextSourceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TeletextSourceSettings` resource
 *
 * @param properties - the TypeScript properties of a `TeletextSourceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TeletextSourceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelTeletextSourceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_TeletextSourceSettingsPropertyValidator(properties).assertSuccess();
    return {
        OutputRectangle: cfnChannelCaptionRectanglePropertyToCloudFormation(properties.outputRectangle),
        PageNumber: cdk.stringToCloudFormation(properties.pageNumber),
    };
}

// @ts-ignore TS6133
function CfnChannelTeletextSourceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.TeletextSourceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TeletextSourceSettingsProperty>();
    ret.addPropertyResult('outputRectangle', 'OutputRectangle', properties.OutputRectangle != null ? CfnChannelCaptionRectanglePropertyFromCloudFormation(properties.OutputRectangle) : undefined);
    ret.addPropertyResult('pageNumber', 'PageNumber', properties.PageNumber != null ? cfn_parse.FromCloudFormation.getString(properties.PageNumber) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings for the temporal filter to apply to the video.
     *
     * The parents of this entity are H264FilterSettings, H265FilterSettings, and Mpeg2FilterSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-temporalfiltersettings.html
     */
    export interface TemporalFilterSettingsProperty {
        /**
         * If you enable this filter, the results are the following:
         * - If the source content is noisy (it contains excessive digital artifacts), the filter cleans up the source.
         * - If the source content is already clean, the filter tends to decrease the bitrate, especially when the rate control mode is QVBR.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-temporalfiltersettings.html#cfn-medialive-channel-temporalfiltersettings-postfiltersharpening
         */
        readonly postFilterSharpening?: string;
        /**
         * Choose a filter strength. We recommend a strength of 1 or 2. A higher strength might take out good information, resulting in an image that is overly soft.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-temporalfiltersettings.html#cfn-medialive-channel-temporalfiltersettings-strength
         */
        readonly strength?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TemporalFilterSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TemporalFilterSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_TemporalFilterSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('postFilterSharpening', cdk.validateString)(properties.postFilterSharpening));
    errors.collect(cdk.propertyValidator('strength', cdk.validateString)(properties.strength));
    return errors.wrap('supplied properties not correct for "TemporalFilterSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TemporalFilterSettings` resource
 *
 * @param properties - the TypeScript properties of a `TemporalFilterSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TemporalFilterSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelTemporalFilterSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_TemporalFilterSettingsPropertyValidator(properties).assertSuccess();
    return {
        PostFilterSharpening: cdk.stringToCloudFormation(properties.postFilterSharpening),
        Strength: cdk.stringToCloudFormation(properties.strength),
    };
}

// @ts-ignore TS6133
function CfnChannelTemporalFilterSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TemporalFilterSettingsProperty>();
    ret.addPropertyResult('postFilterSharpening', 'PostFilterSharpening', properties.PostFilterSharpening != null ? cfn_parse.FromCloudFormation.getString(properties.PostFilterSharpening) : undefined);
    ret.addPropertyResult('strength', 'Strength', properties.Strength != null ? cfn_parse.FromCloudFormation.getString(properties.Strength) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of the timecode in the output.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-timecodeconfig.html
     */
    export interface TimecodeConfigProperty {
        /**
         * Identifies the source for the timecode that will be associated with the channel outputs. Embedded (embedded): Initialize the output timecode with timecode from the source. If no embedded timecode is detected in the source, the system falls back to using "Start at 0" (zerobased). System Clock (systemclock): Use the UTC time. Start at 0 (zerobased): The time of the first frame of the channel will be 00:00:00:00.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-timecodeconfig.html#cfn-medialive-channel-timecodeconfig-source
         */
        readonly source?: string;
        /**
         * The threshold in frames beyond which output timecode is resynchronized to the input timecode. Discrepancies below this threshold are permitted to avoid unnecessary discontinuities in the output timecode. There is no timecode sync when this is not specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-timecodeconfig.html#cfn-medialive-channel-timecodeconfig-syncthreshold
         */
        readonly syncThreshold?: number;
    }
}

/**
 * Determine whether the given properties match those of a `TimecodeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TimecodeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_TimecodeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('source', cdk.validateString)(properties.source));
    errors.collect(cdk.propertyValidator('syncThreshold', cdk.validateNumber)(properties.syncThreshold));
    return errors.wrap('supplied properties not correct for "TimecodeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TimecodeConfig` resource
 *
 * @param properties - the TypeScript properties of a `TimecodeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TimecodeConfig` resource.
 */
// @ts-ignore TS6133
function cfnChannelTimecodeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_TimecodeConfigPropertyValidator(properties).assertSuccess();
    return {
        Source: cdk.stringToCloudFormation(properties.source),
        SyncThreshold: cdk.numberToCloudFormation(properties.syncThreshold),
    };
}

// @ts-ignore TS6133
function CfnChannelTimecodeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.TimecodeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TimecodeConfigProperty>();
    ret.addPropertyResult('source', 'Source', properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined);
    ret.addPropertyResult('syncThreshold', 'SyncThreshold', properties.SyncThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.SyncThreshold) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setup of TTML captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ttmldestinationsettings.html
     */
    export interface TtmlDestinationSettingsProperty {
        /**
         * When set to passthrough, passes through style and position information from a TTML-like input source (TTML, SMPTE-TT, CFF-TT) to the CFF-TT output or TTML output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ttmldestinationsettings.html#cfn-medialive-channel-ttmldestinationsettings-stylecontrol
         */
        readonly styleControl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TtmlDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `TtmlDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_TtmlDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('styleControl', cdk.validateString)(properties.styleControl));
    return errors.wrap('supplied properties not correct for "TtmlDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TtmlDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `TtmlDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.TtmlDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelTtmlDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_TtmlDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        StyleControl: cdk.stringToCloudFormation(properties.styleControl),
    };
}

// @ts-ignore TS6133
function CfnChannelTtmlDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.TtmlDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TtmlDestinationSettingsProperty>();
    ret.addPropertyResult('styleControl', 'StyleControl', properties.StyleControl != null ? cfn_parse.FromCloudFormation.getString(properties.StyleControl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of a UDP output.
     *
     * The parent of this entity is UdpOutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpcontainersettings.html
     */
    export interface UdpContainerSettingsProperty {
        /**
         * The M2TS configuration for this UDP output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpcontainersettings.html#cfn-medialive-channel-udpcontainersettings-m2tssettings
         */
        readonly m2TsSettings?: CfnChannel.M2tsSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `UdpContainerSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `UdpContainerSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_UdpContainerSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('m2TsSettings', CfnChannel_M2tsSettingsPropertyValidator)(properties.m2TsSettings));
    return errors.wrap('supplied properties not correct for "UdpContainerSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpContainerSettings` resource
 *
 * @param properties - the TypeScript properties of a `UdpContainerSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpContainerSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelUdpContainerSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_UdpContainerSettingsPropertyValidator(properties).assertSuccess();
    return {
        M2tsSettings: cfnChannelM2tsSettingsPropertyToCloudFormation(properties.m2TsSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelUdpContainerSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.UdpContainerSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.UdpContainerSettingsProperty>();
    ret.addPropertyResult('m2TsSettings', 'M2tsSettings', properties.M2tsSettings != null ? CfnChannelM2tsSettingsPropertyFromCloudFormation(properties.M2tsSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of a UDP output group.
     *
     * The parent of this entity is OutputGroupSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpgroupsettings.html
     */
    export interface UdpGroupSettingsProperty {
        /**
         * Specifies the behavior of the last resort when the input video is lost, and no more backup inputs are available. When dropTs is selected, the entire transport stream stops emitting. When dropProgram is selected, the program can be dropped from the transport stream (and replaced with null packets to meet the TS bitrate requirement). Or when emitProgram is selected, the transport stream continues to be produced normally with repeat frames, black frames, or slate frames substituted for the absent input video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpgroupsettings.html#cfn-medialive-channel-udpgroupsettings-inputlossaction
         */
        readonly inputLossAction?: string;
        /**
         * Indicates the ID3 frame that has the timecode.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpgroupsettings.html#cfn-medialive-channel-udpgroupsettings-timedmetadataid3frame
         */
        readonly timedMetadataId3Frame?: string;
        /**
         * The timed metadata interval in seconds.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpgroupsettings.html#cfn-medialive-channel-udpgroupsettings-timedmetadataid3period
         */
        readonly timedMetadataId3Period?: number;
    }
}

/**
 * Determine whether the given properties match those of a `UdpGroupSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `UdpGroupSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_UdpGroupSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('inputLossAction', cdk.validateString)(properties.inputLossAction));
    errors.collect(cdk.propertyValidator('timedMetadataId3Frame', cdk.validateString)(properties.timedMetadataId3Frame));
    errors.collect(cdk.propertyValidator('timedMetadataId3Period', cdk.validateNumber)(properties.timedMetadataId3Period));
    return errors.wrap('supplied properties not correct for "UdpGroupSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpGroupSettings` resource
 *
 * @param properties - the TypeScript properties of a `UdpGroupSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpGroupSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelUdpGroupSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_UdpGroupSettingsPropertyValidator(properties).assertSuccess();
    return {
        InputLossAction: cdk.stringToCloudFormation(properties.inputLossAction),
        TimedMetadataId3Frame: cdk.stringToCloudFormation(properties.timedMetadataId3Frame),
        TimedMetadataId3Period: cdk.numberToCloudFormation(properties.timedMetadataId3Period),
    };
}

// @ts-ignore TS6133
function CfnChannelUdpGroupSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.UdpGroupSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.UdpGroupSettingsProperty>();
    ret.addPropertyResult('inputLossAction', 'InputLossAction', properties.InputLossAction != null ? cfn_parse.FromCloudFormation.getString(properties.InputLossAction) : undefined);
    ret.addPropertyResult('timedMetadataId3Frame', 'TimedMetadataId3Frame', properties.TimedMetadataId3Frame != null ? cfn_parse.FromCloudFormation.getString(properties.TimedMetadataId3Frame) : undefined);
    ret.addPropertyResult('timedMetadataId3Period', 'TimedMetadataId3Period', properties.TimedMetadataId3Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimedMetadataId3Period) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for one UDP output.
     *
     * The parent of this entity is OutputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpoutputsettings.html
     */
    export interface UdpOutputSettingsProperty {
        /**
         * The UDP output buffering in milliseconds. Larger values increase latency through the transcoder but simultaneously assist the transcoder in maintaining a constant, low-jitter UDP/RTP output while accommodating clock recovery, input switching, input disruptions, picture reordering, and so on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpoutputsettings.html#cfn-medialive-channel-udpoutputsettings-buffermsec
         */
        readonly bufferMsec?: number;
        /**
         * The settings for the UDP output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpoutputsettings.html#cfn-medialive-channel-udpoutputsettings-containersettings
         */
        readonly containerSettings?: CfnChannel.UdpContainerSettingsProperty | cdk.IResolvable;
        /**
         * The destination address and port number for RTP or UDP packets. These can be unicast or multicast RTP or UDP (for example, rtp://239.10.10.10:5001 or udp://10.100.100.100:5002).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpoutputsettings.html#cfn-medialive-channel-udpoutputsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
        /**
         * The settings for enabling and adjusting Forward Error Correction on UDP outputs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpoutputsettings.html#cfn-medialive-channel-udpoutputsettings-fecoutputsettings
         */
        readonly fecOutputSettings?: CfnChannel.FecOutputSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `UdpOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `UdpOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_UdpOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bufferMsec', cdk.validateNumber)(properties.bufferMsec));
    errors.collect(cdk.propertyValidator('containerSettings', CfnChannel_UdpContainerSettingsPropertyValidator)(properties.containerSettings));
    errors.collect(cdk.propertyValidator('destination', CfnChannel_OutputLocationRefPropertyValidator)(properties.destination));
    errors.collect(cdk.propertyValidator('fecOutputSettings', CfnChannel_FecOutputSettingsPropertyValidator)(properties.fecOutputSettings));
    return errors.wrap('supplied properties not correct for "UdpOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `UdpOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.UdpOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelUdpOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_UdpOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        BufferMsec: cdk.numberToCloudFormation(properties.bufferMsec),
        ContainerSettings: cfnChannelUdpContainerSettingsPropertyToCloudFormation(properties.containerSettings),
        Destination: cfnChannelOutputLocationRefPropertyToCloudFormation(properties.destination),
        FecOutputSettings: cfnChannelFecOutputSettingsPropertyToCloudFormation(properties.fecOutputSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelUdpOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.UdpOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.UdpOutputSettingsProperty>();
    ret.addPropertyResult('bufferMsec', 'BufferMsec', properties.BufferMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.BufferMsec) : undefined);
    ret.addPropertyResult('containerSettings', 'ContainerSettings', properties.ContainerSettings != null ? CfnChannelUdpContainerSettingsPropertyFromCloudFormation(properties.ContainerSettings) : undefined);
    ret.addPropertyResult('destination', 'Destination', properties.Destination != null ? CfnChannelOutputLocationRefPropertyFromCloudFormation(properties.Destination) : undefined);
    ret.addPropertyResult('fecOutputSettings', 'FecOutputSettings', properties.FecOutputSettings != null ? CfnChannelFecOutputSettingsPropertyFromCloudFormation(properties.FecOutputSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * MediaLive will perform a failover if content is considered black for the specified period.
     *
     * The parent of this entity is FailoverConditionSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoblackfailoversettings.html
     */
    export interface VideoBlackFailoverSettingsProperty {
        /**
         * A value used in calculating the threshold below which MediaLive considers a pixel to be 'black'. For the input to be considered black, every pixel in a frame must be below this threshold. The threshold is calculated as a percentage (expressed as a decimal) of white. Therefore .1 means 10% white (or 90% black). Note how the formula works for any color depth. For example, if you set this field to 0.1 in 10-bit color depth: (1023*0.1=102.3), which means a pixel value of 102 or less is 'black'. If you set this field to .1 in an 8-bit color depth: (255*0.1=25.5), which means a pixel value of 25 or less is 'black'. The range is 0.0 to 1.0, with any number of decimal places.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoblackfailoversettings.html#cfn-medialive-channel-videoblackfailoversettings-blackdetectthreshold
         */
        readonly blackDetectThreshold?: number;
        /**
         * The amount of time (in milliseconds) that the active input must be black before automatic input failover occurs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoblackfailoversettings.html#cfn-medialive-channel-videoblackfailoversettings-videoblackthresholdmsec
         */
        readonly videoBlackThresholdMsec?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VideoBlackFailoverSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VideoBlackFailoverSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoBlackFailoverSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('blackDetectThreshold', cdk.validateNumber)(properties.blackDetectThreshold));
    errors.collect(cdk.propertyValidator('videoBlackThresholdMsec', cdk.validateNumber)(properties.videoBlackThresholdMsec));
    return errors.wrap('supplied properties not correct for "VideoBlackFailoverSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoBlackFailoverSettings` resource
 *
 * @param properties - the TypeScript properties of a `VideoBlackFailoverSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoBlackFailoverSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoBlackFailoverSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoBlackFailoverSettingsPropertyValidator(properties).assertSuccess();
    return {
        BlackDetectThreshold: cdk.numberToCloudFormation(properties.blackDetectThreshold),
        VideoBlackThresholdMsec: cdk.numberToCloudFormation(properties.videoBlackThresholdMsec),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoBlackFailoverSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoBlackFailoverSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoBlackFailoverSettingsProperty>();
    ret.addPropertyResult('blackDetectThreshold', 'BlackDetectThreshold', properties.BlackDetectThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlackDetectThreshold) : undefined);
    ret.addPropertyResult('videoBlackThresholdMsec', 'VideoBlackThresholdMsec', properties.VideoBlackThresholdMsec != null ? cfn_parse.FromCloudFormation.getNumber(properties.VideoBlackThresholdMsec) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The settings for the video codec in the output.
     *
     * The parent of this entity is VideoDescription.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videocodecsettings.html
     */
    export interface VideoCodecSettingsProperty {
        /**
         * The settings for the video codec in a frame capture output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videocodecsettings.html#cfn-medialive-channel-videocodecsettings-framecapturesettings
         */
        readonly frameCaptureSettings?: CfnChannel.FrameCaptureSettingsProperty | cdk.IResolvable;
        /**
         * The settings for the H.264 codec in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videocodecsettings.html#cfn-medialive-channel-videocodecsettings-h264settings
         */
        readonly h264Settings?: CfnChannel.H264SettingsProperty | cdk.IResolvable;
        /**
         * Settings for video encoded with the H265 codec.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videocodecsettings.html#cfn-medialive-channel-videocodecsettings-h265settings
         */
        readonly h265Settings?: CfnChannel.H265SettingsProperty | cdk.IResolvable;
        /**
         * Settings for video encoded with the MPEG-2 codec.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videocodecsettings.html#cfn-medialive-channel-videocodecsettings-mpeg2settings
         */
        readonly mpeg2Settings?: CfnChannel.Mpeg2SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VideoCodecSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VideoCodecSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoCodecSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('frameCaptureSettings', CfnChannel_FrameCaptureSettingsPropertyValidator)(properties.frameCaptureSettings));
    errors.collect(cdk.propertyValidator('h264Settings', CfnChannel_H264SettingsPropertyValidator)(properties.h264Settings));
    errors.collect(cdk.propertyValidator('h265Settings', CfnChannel_H265SettingsPropertyValidator)(properties.h265Settings));
    errors.collect(cdk.propertyValidator('mpeg2Settings', CfnChannel_Mpeg2SettingsPropertyValidator)(properties.mpeg2Settings));
    return errors.wrap('supplied properties not correct for "VideoCodecSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoCodecSettings` resource
 *
 * @param properties - the TypeScript properties of a `VideoCodecSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoCodecSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoCodecSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoCodecSettingsPropertyValidator(properties).assertSuccess();
    return {
        FrameCaptureSettings: cfnChannelFrameCaptureSettingsPropertyToCloudFormation(properties.frameCaptureSettings),
        H264Settings: cfnChannelH264SettingsPropertyToCloudFormation(properties.h264Settings),
        H265Settings: cfnChannelH265SettingsPropertyToCloudFormation(properties.h265Settings),
        Mpeg2Settings: cfnChannelMpeg2SettingsPropertyToCloudFormation(properties.mpeg2Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoCodecSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoCodecSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoCodecSettingsProperty>();
    ret.addPropertyResult('frameCaptureSettings', 'FrameCaptureSettings', properties.FrameCaptureSettings != null ? CfnChannelFrameCaptureSettingsPropertyFromCloudFormation(properties.FrameCaptureSettings) : undefined);
    ret.addPropertyResult('h264Settings', 'H264Settings', properties.H264Settings != null ? CfnChannelH264SettingsPropertyFromCloudFormation(properties.H264Settings) : undefined);
    ret.addPropertyResult('h265Settings', 'H265Settings', properties.H265Settings != null ? CfnChannelH265SettingsPropertyFromCloudFormation(properties.H265Settings) : undefined);
    ret.addPropertyResult('mpeg2Settings', 'Mpeg2Settings', properties.Mpeg2Settings != null ? CfnChannelMpeg2SettingsPropertyFromCloudFormation(properties.Mpeg2Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Encoding information for one output video.
     *
     * The parent of this entity is EncoderSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html
     */
    export interface VideoDescriptionProperty {
        /**
         * The video codec settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-codecsettings
         */
        readonly codecSettings?: CfnChannel.VideoCodecSettingsProperty | cdk.IResolvable;
        /**
         * The output video height, in pixels. This must be an even number. For most codecs, you can keep this field and width blank in order to use the height and width (resolution) from the source. Note that we don't recommend keeping the field blank. For the Frame Capture codec, height and width are required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-height
         */
        readonly height?: number;
        /**
         * The name of this VideoDescription. Outputs use this name to uniquely identify this description. Description names should be unique within this channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-name
         */
        readonly name?: string;
        /**
         * Indicates how to respond to the AFD values in the input stream. RESPOND causes input video to be clipped, depending on the AFD value, input display aspect ratio, and output display aspect ratio, and (except for the FRAMECAPTURE codec) includes the values in the output. PASSTHROUGH (does not apply to FRAMECAPTURE codec) ignores the AFD values and includes the values in the output, so input video is not clipped. NONE ignores the AFD values and does not include the values through to the output, so input video is not clipped.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-respondtoafd
         */
        readonly respondToAfd?: string;
        /**
         * STRETCHTOOUTPUT configures the output position to stretch the video to the specified output resolution (height and width). This option overrides any position value. DEFAULT might insert black boxes (pillar boxes or letter boxes) around the video to provide the specified output resolution.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-scalingbehavior
         */
        readonly scalingBehavior?: string;
        /**
         * Changes the strength of the anti-alias filter used for scaling. 0 is the softest setting, and 100 is the sharpest. We recommend a setting of 50 for most content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-sharpness
         */
        readonly sharpness?: number;
        /**
         * The output video width, in pixels. It must be an even number. For most codecs, you can keep this field and height blank in order to use the height and width (resolution) from the source. Note that we don't recommend keeping the field blank. For the Frame Capture codec, height and width are required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videodescription.html#cfn-medialive-channel-videodescription-width
         */
        readonly width?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VideoDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `VideoDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('codecSettings', CfnChannel_VideoCodecSettingsPropertyValidator)(properties.codecSettings));
    errors.collect(cdk.propertyValidator('height', cdk.validateNumber)(properties.height));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('respondToAfd', cdk.validateString)(properties.respondToAfd));
    errors.collect(cdk.propertyValidator('scalingBehavior', cdk.validateString)(properties.scalingBehavior));
    errors.collect(cdk.propertyValidator('sharpness', cdk.validateNumber)(properties.sharpness));
    errors.collect(cdk.propertyValidator('width', cdk.validateNumber)(properties.width));
    return errors.wrap('supplied properties not correct for "VideoDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoDescription` resource
 *
 * @param properties - the TypeScript properties of a `VideoDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoDescription` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoDescriptionPropertyValidator(properties).assertSuccess();
    return {
        CodecSettings: cfnChannelVideoCodecSettingsPropertyToCloudFormation(properties.codecSettings),
        Height: cdk.numberToCloudFormation(properties.height),
        Name: cdk.stringToCloudFormation(properties.name),
        RespondToAfd: cdk.stringToCloudFormation(properties.respondToAfd),
        ScalingBehavior: cdk.stringToCloudFormation(properties.scalingBehavior),
        Sharpness: cdk.numberToCloudFormation(properties.sharpness),
        Width: cdk.numberToCloudFormation(properties.width),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoDescriptionProperty>();
    ret.addPropertyResult('codecSettings', 'CodecSettings', properties.CodecSettings != null ? CfnChannelVideoCodecSettingsPropertyFromCloudFormation(properties.CodecSettings) : undefined);
    ret.addPropertyResult('height', 'Height', properties.Height != null ? cfn_parse.FromCloudFormation.getNumber(properties.Height) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('respondToAfd', 'RespondToAfd', properties.RespondToAfd != null ? cfn_parse.FromCloudFormation.getString(properties.RespondToAfd) : undefined);
    ret.addPropertyResult('scalingBehavior', 'ScalingBehavior', properties.ScalingBehavior != null ? cfn_parse.FromCloudFormation.getString(properties.ScalingBehavior) : undefined);
    ret.addPropertyResult('sharpness', 'Sharpness', properties.Sharpness != null ? cfn_parse.FromCloudFormation.getNumber(properties.Sharpness) : undefined);
    ret.addPropertyResult('width', 'Width', properties.Width != null ? cfn_parse.FromCloudFormation.getNumber(properties.Width) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the video to extract from the input. An input can contain only one video selector.
     *
     * The parent of this entity is InputSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselector.html
     */
    export interface VideoSelectorProperty {
        /**
         * Specifies the color space of an input. This setting works in tandem with colorSpaceConversion to determine if MediaLive will perform any conversion.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselector.html#cfn-medialive-channel-videoselector-colorspace
         */
        readonly colorSpace?: string;
        /**
         * Settings to configure color space settings in the incoming video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselector.html#cfn-medialive-channel-videoselector-colorspacesettings
         */
        readonly colorSpaceSettings?: CfnChannel.VideoSelectorColorSpaceSettingsProperty | cdk.IResolvable;
        /**
         * Applies only if colorSpace is a value other than Follow. This field controls how the value in the colorSpace field is used. Fallback means that when the input does include color space data, that data is used, but when the input has no color space data, the value in colorSpace is used. Choose fallback if your input is sometimes missing color space data, but when it does have color space data, that data is correct. Force means to always use the value in colorSpace. Choose force if your input usually has no color space data or might have unreliable color space data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselector.html#cfn-medialive-channel-videoselector-colorspaceusage
         */
        readonly colorSpaceUsage?: string;
        /**
         * Information about the video to select from the content.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselector.html#cfn-medialive-channel-videoselector-selectorsettings
         */
        readonly selectorSettings?: CfnChannel.VideoSelectorSettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VideoSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `VideoSelectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoSelectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('colorSpace', cdk.validateString)(properties.colorSpace));
    errors.collect(cdk.propertyValidator('colorSpaceSettings', CfnChannel_VideoSelectorColorSpaceSettingsPropertyValidator)(properties.colorSpaceSettings));
    errors.collect(cdk.propertyValidator('colorSpaceUsage', cdk.validateString)(properties.colorSpaceUsage));
    errors.collect(cdk.propertyValidator('selectorSettings', CfnChannel_VideoSelectorSettingsPropertyValidator)(properties.selectorSettings));
    return errors.wrap('supplied properties not correct for "VideoSelectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelector` resource
 *
 * @param properties - the TypeScript properties of a `VideoSelectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelector` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoSelectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoSelectorPropertyValidator(properties).assertSuccess();
    return {
        ColorSpace: cdk.stringToCloudFormation(properties.colorSpace),
        ColorSpaceSettings: cfnChannelVideoSelectorColorSpaceSettingsPropertyToCloudFormation(properties.colorSpaceSettings),
        ColorSpaceUsage: cdk.stringToCloudFormation(properties.colorSpaceUsage),
        SelectorSettings: cfnChannelVideoSelectorSettingsPropertyToCloudFormation(properties.selectorSettings),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoSelectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoSelectorProperty>();
    ret.addPropertyResult('colorSpace', 'ColorSpace', properties.ColorSpace != null ? cfn_parse.FromCloudFormation.getString(properties.ColorSpace) : undefined);
    ret.addPropertyResult('colorSpaceSettings', 'ColorSpaceSettings', properties.ColorSpaceSettings != null ? CfnChannelVideoSelectorColorSpaceSettingsPropertyFromCloudFormation(properties.ColorSpaceSettings) : undefined);
    ret.addPropertyResult('colorSpaceUsage', 'ColorSpaceUsage', properties.ColorSpaceUsage != null ? cfn_parse.FromCloudFormation.getString(properties.ColorSpaceUsage) : undefined);
    ret.addPropertyResult('selectorSettings', 'SelectorSettings', properties.SelectorSettings != null ? CfnChannelVideoSelectorSettingsPropertyFromCloudFormation(properties.SelectorSettings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to configure color space settings in the incoming video.
     *
     * The parent of this entity is VideoSelector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorcolorspacesettings.html
     */
    export interface VideoSelectorColorSpaceSettingsProperty {
        /**
         * Settings to configure color space settings in the incoming video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorcolorspacesettings.html#cfn-medialive-channel-videoselectorcolorspacesettings-hdr10settings
         */
        readonly hdr10Settings?: CfnChannel.Hdr10SettingsProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VideoSelectorColorSpaceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VideoSelectorColorSpaceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoSelectorColorSpaceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('hdr10Settings', CfnChannel_Hdr10SettingsPropertyValidator)(properties.hdr10Settings));
    return errors.wrap('supplied properties not correct for "VideoSelectorColorSpaceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorColorSpaceSettings` resource
 *
 * @param properties - the TypeScript properties of a `VideoSelectorColorSpaceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorColorSpaceSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoSelectorColorSpaceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoSelectorColorSpaceSettingsPropertyValidator(properties).assertSuccess();
    return {
        Hdr10Settings: cfnChannelHdr10SettingsPropertyToCloudFormation(properties.hdr10Settings),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoSelectorColorSpaceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoSelectorColorSpaceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoSelectorColorSpaceSettingsProperty>();
    ret.addPropertyResult('hdr10Settings', 'Hdr10Settings', properties.Hdr10Settings != null ? CfnChannelHdr10SettingsPropertyFromCloudFormation(properties.Hdr10Settings) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Selects a specific PID from within a video source.
     *
     * The parent of this entity is VideoSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorpid.html
     */
    export interface VideoSelectorPidProperty {
        /**
         * Selects a specific PID from within a video source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorpid.html#cfn-medialive-channel-videoselectorpid-pid
         */
        readonly pid?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VideoSelectorPidProperty`
 *
 * @param properties - the TypeScript properties of a `VideoSelectorPidProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoSelectorPidPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('pid', cdk.validateNumber)(properties.pid));
    return errors.wrap('supplied properties not correct for "VideoSelectorPidProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorPid` resource
 *
 * @param properties - the TypeScript properties of a `VideoSelectorPidProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorPid` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoSelectorPidPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoSelectorPidPropertyValidator(properties).assertSuccess();
    return {
        Pid: cdk.numberToCloudFormation(properties.pid),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoSelectorPidPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoSelectorPidProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoSelectorPidProperty>();
    ret.addPropertyResult('pid', 'Pid', properties.Pid != null ? cfn_parse.FromCloudFormation.getNumber(properties.Pid) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Used to extract video by the program ID.
     *
     * The parent of this entity is VideoSelectorSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorprogramid.html
     */
    export interface VideoSelectorProgramIdProperty {
        /**
         * Selects a specific program from within a multi-program transport stream. If the program doesn't exist, MediaLive selects the first program within the transport stream by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorprogramid.html#cfn-medialive-channel-videoselectorprogramid-programid
         */
        readonly programId?: number;
    }
}

/**
 * Determine whether the given properties match those of a `VideoSelectorProgramIdProperty`
 *
 * @param properties - the TypeScript properties of a `VideoSelectorProgramIdProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoSelectorProgramIdPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('programId', cdk.validateNumber)(properties.programId));
    return errors.wrap('supplied properties not correct for "VideoSelectorProgramIdProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorProgramId` resource
 *
 * @param properties - the TypeScript properties of a `VideoSelectorProgramIdProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorProgramId` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoSelectorProgramIdPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoSelectorProgramIdPropertyValidator(properties).assertSuccess();
    return {
        ProgramId: cdk.numberToCloudFormation(properties.programId),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoSelectorProgramIdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoSelectorProgramIdProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoSelectorProgramIdProperty>();
    ret.addPropertyResult('programId', 'ProgramId', properties.ProgramId != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Information about the video to extract from the input.
     *
     * The parent of this entity is VideoSelector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorsettings.html
     */
    export interface VideoSelectorSettingsProperty {
        /**
         * Used to extract video by PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorsettings.html#cfn-medialive-channel-videoselectorsettings-videoselectorpid
         */
        readonly videoSelectorPid?: CfnChannel.VideoSelectorPidProperty | cdk.IResolvable;
        /**
         * Used to extract video by program ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorsettings.html#cfn-medialive-channel-videoselectorsettings-videoselectorprogramid
         */
        readonly videoSelectorProgramId?: CfnChannel.VideoSelectorProgramIdProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `VideoSelectorSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VideoSelectorSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VideoSelectorSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('videoSelectorPid', CfnChannel_VideoSelectorPidPropertyValidator)(properties.videoSelectorPid));
    errors.collect(cdk.propertyValidator('videoSelectorProgramId', CfnChannel_VideoSelectorProgramIdPropertyValidator)(properties.videoSelectorProgramId));
    return errors.wrap('supplied properties not correct for "VideoSelectorSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorSettings` resource
 *
 * @param properties - the TypeScript properties of a `VideoSelectorSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VideoSelectorSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelVideoSelectorSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VideoSelectorSettingsPropertyValidator(properties).assertSuccess();
    return {
        VideoSelectorPid: cfnChannelVideoSelectorPidPropertyToCloudFormation(properties.videoSelectorPid),
        VideoSelectorProgramId: cfnChannelVideoSelectorProgramIdPropertyToCloudFormation(properties.videoSelectorProgramId),
    };
}

// @ts-ignore TS6133
function CfnChannelVideoSelectorSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VideoSelectorSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VideoSelectorSettingsProperty>();
    ret.addPropertyResult('videoSelectorPid', 'VideoSelectorPid', properties.VideoSelectorPid != null ? CfnChannelVideoSelectorPidPropertyFromCloudFormation(properties.VideoSelectorPid) : undefined);
    ret.addPropertyResult('videoSelectorProgramId', 'VideoSelectorProgramId', properties.VideoSelectorProgramId != null ? CfnChannelVideoSelectorProgramIdPropertyFromCloudFormation(properties.VideoSelectorProgramId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * Settings to enable VPC mode in the channel, so that the endpoints for all outputs are in your VPC.
     *
     * This entity is at the top level in the channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-vpcoutputsettings.html
     */
    export interface VpcOutputSettingsProperty {
        /**
         * List of public address allocation IDs to associate with ENIs that will be created in Output VPC. Must specify one for SINGLE_PIPELINE, two for STANDARD channels
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-vpcoutputsettings.html#cfn-medialive-channel-vpcoutputsettings-publicaddressallocationids
         */
        readonly publicAddressAllocationIds?: string[];
        /**
         * A list of up to 5 EC2 VPC security group IDs to attach to the Output VPC network interfaces.
         * If none are specified then the VPC default security group will be used
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-vpcoutputsettings.html#cfn-medialive-channel-vpcoutputsettings-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * A list of VPC subnet IDs from the same VPC.
         * If STANDARD channel, subnet IDs must be mapped to two unique availability zones (AZ).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-vpcoutputsettings.html#cfn-medialive-channel-vpcoutputsettings-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `VpcOutputSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcOutputSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_VpcOutputSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('publicAddressAllocationIds', cdk.listValidator(cdk.validateString))(properties.publicAddressAllocationIds));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "VpcOutputSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VpcOutputSettings` resource
 *
 * @param properties - the TypeScript properties of a `VpcOutputSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.VpcOutputSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelVpcOutputSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_VpcOutputSettingsPropertyValidator(properties).assertSuccess();
    return {
        PublicAddressAllocationIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.publicAddressAllocationIds),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnChannelVpcOutputSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.VpcOutputSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.VpcOutputSettingsProperty>();
    ret.addPropertyResult('publicAddressAllocationIds', 'PublicAddressAllocationIds', properties.PublicAddressAllocationIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PublicAddressAllocationIds) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The setup of WAV audio in the output.
     *
     * The parent of this entity is AudioCodecSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-wavsettings.html
     */
    export interface WavSettingsProperty {
        /**
         * Bits per sample.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-wavsettings.html#cfn-medialive-channel-wavsettings-bitdepth
         */
        readonly bitDepth?: number;
        /**
         * The audio coding mode for the WAV audio. The mode determines the number of channels in the audio.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-wavsettings.html#cfn-medialive-channel-wavsettings-codingmode
         */
        readonly codingMode?: string;
        /**
         * Sample rate in Hz.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-wavsettings.html#cfn-medialive-channel-wavsettings-samplerate
         */
        readonly sampleRate?: number;
    }
}

/**
 * Determine whether the given properties match those of a `WavSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `WavSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_WavSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('bitDepth', cdk.validateNumber)(properties.bitDepth));
    errors.collect(cdk.propertyValidator('codingMode', cdk.validateString)(properties.codingMode));
    errors.collect(cdk.propertyValidator('sampleRate', cdk.validateNumber)(properties.sampleRate));
    return errors.wrap('supplied properties not correct for "WavSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.WavSettings` resource
 *
 * @param properties - the TypeScript properties of a `WavSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.WavSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelWavSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_WavSettingsPropertyValidator(properties).assertSuccess();
    return {
        BitDepth: cdk.numberToCloudFormation(properties.bitDepth),
        CodingMode: cdk.stringToCloudFormation(properties.codingMode),
        SampleRate: cdk.numberToCloudFormation(properties.sampleRate),
    };
}

// @ts-ignore TS6133
function CfnChannelWavSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.WavSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.WavSettingsProperty>();
    ret.addPropertyResult('bitDepth', 'BitDepth', properties.BitDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.BitDepth) : undefined);
    ret.addPropertyResult('codingMode', 'CodingMode', properties.CodingMode != null ? cfn_parse.FromCloudFormation.getString(properties.CodingMode) : undefined);
    ret.addPropertyResult('sampleRate', 'SampleRate', properties.SampleRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SampleRate) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnChannel {
    /**
     * The configuration of Web VTT captions in the output.
     *
     * The parent of this entity is CaptionDestinationSettings.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-webvttdestinationsettings.html
     */
    export interface WebvttDestinationSettingsProperty {
        /**
         * Controls whether the color and position of the source captions is passed through to the WebVTT output captions. PASSTHROUGH - Valid only if the source captions are EMBEDDED or TELETEXT. NO_STYLE_DATA - Don't pass through the style. The output captions will not contain any font styling information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-webvttdestinationsettings.html#cfn-medialive-channel-webvttdestinationsettings-stylecontrol
         */
        readonly styleControl?: string;
    }
}

/**
 * Determine whether the given properties match those of a `WebvttDestinationSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `WebvttDestinationSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnChannel_WebvttDestinationSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('styleControl', cdk.validateString)(properties.styleControl));
    return errors.wrap('supplied properties not correct for "WebvttDestinationSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Channel.WebvttDestinationSettings` resource
 *
 * @param properties - the TypeScript properties of a `WebvttDestinationSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Channel.WebvttDestinationSettings` resource.
 */
// @ts-ignore TS6133
function cfnChannelWebvttDestinationSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnChannel_WebvttDestinationSettingsPropertyValidator(properties).assertSuccess();
    return {
        StyleControl: cdk.stringToCloudFormation(properties.styleControl),
    };
}

// @ts-ignore TS6133
function CfnChannelWebvttDestinationSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.WebvttDestinationSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.WebvttDestinationSettingsProperty>();
    ret.addPropertyResult('styleControl', 'StyleControl', properties.StyleControl != null ? cfn_parse.FromCloudFormation.getString(properties.StyleControl) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInput`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html
 */
export interface CfnInputProps {

    /**
     * Settings that apply only if the input is a push type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-destinations
     */
    readonly destinations?: Array<CfnInput.InputDestinationRequestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Settings that apply only if the input is an Elemental Link input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputdevices
     */
    readonly inputDevices?: Array<CfnInput.InputDeviceSettingsProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The list of input security groups (referenced by IDs) to attach to the input if the input is a push type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputsecuritygroups
     */
    readonly inputSecurityGroups?: string[];

    /**
     * Settings that apply only if the input is a MediaConnect input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-mediaconnectflows
     */
    readonly mediaConnectFlows?: Array<CfnInput.MediaConnectFlowRequestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A name for the input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-name
     */
    readonly name?: string;

    /**
     * The IAM role for MediaLive to assume when creating a MediaConnect input or Amazon VPC input. This doesn't apply to other types of inputs. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-rolearn
     */
    readonly roleArn?: string;

    /**
     * Settings that apply only if the input is a pull type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-sources
     */
    readonly sources?: Array<CfnInput.InputSourceRequestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A collection of tags for this input. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-tags
     */
    readonly tags?: any;

    /**
     * The type for this input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-type
     */
    readonly type?: string;

    /**
     * Settings that apply only if the input is an push input where the source is on Amazon VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-vpc
     */
    readonly vpc?: CfnInput.InputVpcRequestProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnInputProps`
 *
 * @param properties - the TypeScript properties of a `CfnInputProps`
 *
 * @returns the result of the validation.
 */
function CfnInputPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('destinations', cdk.listValidator(CfnInput_InputDestinationRequestPropertyValidator))(properties.destinations));
    errors.collect(cdk.propertyValidator('inputDevices', cdk.listValidator(CfnInput_InputDeviceSettingsPropertyValidator))(properties.inputDevices));
    errors.collect(cdk.propertyValidator('inputSecurityGroups', cdk.listValidator(cdk.validateString))(properties.inputSecurityGroups));
    errors.collect(cdk.propertyValidator('mediaConnectFlows', cdk.listValidator(CfnInput_MediaConnectFlowRequestPropertyValidator))(properties.mediaConnectFlows));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('sources', cdk.listValidator(CfnInput_InputSourceRequestPropertyValidator))(properties.sources));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    errors.collect(cdk.propertyValidator('vpc', CfnInput_InputVpcRequestPropertyValidator)(properties.vpc));
    return errors.wrap('supplied properties not correct for "CfnInputProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input` resource
 *
 * @param properties - the TypeScript properties of a `CfnInputProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input` resource.
 */
// @ts-ignore TS6133
function cfnInputPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInputPropsValidator(properties).assertSuccess();
    return {
        Destinations: cdk.listMapper(cfnInputInputDestinationRequestPropertyToCloudFormation)(properties.destinations),
        InputDevices: cdk.listMapper(cfnInputInputDeviceSettingsPropertyToCloudFormation)(properties.inputDevices),
        InputSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.inputSecurityGroups),
        MediaConnectFlows: cdk.listMapper(cfnInputMediaConnectFlowRequestPropertyToCloudFormation)(properties.mediaConnectFlows),
        Name: cdk.stringToCloudFormation(properties.name),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        Sources: cdk.listMapper(cfnInputInputSourceRequestPropertyToCloudFormation)(properties.sources),
        Tags: cdk.objectToCloudFormation(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
        Vpc: cfnInputInputVpcRequestPropertyToCloudFormation(properties.vpc),
    };
}

// @ts-ignore TS6133
function CfnInputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInputProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInputProps>();
    ret.addPropertyResult('destinations', 'Destinations', properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnInputInputDestinationRequestPropertyFromCloudFormation)(properties.Destinations) : undefined);
    ret.addPropertyResult('inputDevices', 'InputDevices', properties.InputDevices != null ? cfn_parse.FromCloudFormation.getArray(CfnInputInputDeviceSettingsPropertyFromCloudFormation)(properties.InputDevices) : undefined);
    ret.addPropertyResult('inputSecurityGroups', 'InputSecurityGroups', properties.InputSecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InputSecurityGroups) : undefined);
    ret.addPropertyResult('mediaConnectFlows', 'MediaConnectFlows', properties.MediaConnectFlows != null ? cfn_parse.FromCloudFormation.getArray(CfnInputMediaConnectFlowRequestPropertyFromCloudFormation)(properties.MediaConnectFlows) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('roleArn', 'RoleArn', properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined);
    ret.addPropertyResult('sources', 'Sources', properties.Sources != null ? cfn_parse.FromCloudFormation.getArray(CfnInputInputSourceRequestPropertyFromCloudFormation)(properties.Sources) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addPropertyResult('vpc', 'Vpc', properties.Vpc != null ? CfnInputInputVpcRequestPropertyFromCloudFormation(properties.Vpc) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaLive::Input`
 *
 * The AWS::MediaLive::Input resource is a MediaLive resource type that creates an input.
 *
 * A MediaLive input holds information that describes how the MediaLive channel is connected to the upstream system that is providing the source content that is to be transcoded.
 *
 * @cloudformationResource AWS::MediaLive::Input
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html
 */
export class CfnInput extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::Input";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInput {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInputPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInput(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the MediaLive input. For example: arn:aws:medialive:us-west-1:111122223333:medialive:input:1234567. MediaLive creates this ARN when it creates the input.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * For a push input, the the destination or destinations for the input. The destinations are the URLs of locations on MediaLive where the upstream system pushes the content to, for this input. MediaLive creates these addresses when it creates the input.
     * @cloudformationAttribute Destinations
     */
    public readonly attrDestinations: string[];

    /**
     * For a pull input, the source or sources for the input. The sources are the URLs of locations on the upstream system where MediaLive pulls the content from, for this input. You included these URLs in the create request.
     * @cloudformationAttribute Sources
     */
    public readonly attrSources: string[];

    /**
     * Settings that apply only if the input is a push type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-destinations
     */
    public destinations: Array<CfnInput.InputDestinationRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Settings that apply only if the input is an Elemental Link input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputdevices
     */
    public inputDevices: Array<CfnInput.InputDeviceSettingsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The list of input security groups (referenced by IDs) to attach to the input if the input is a push type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputsecuritygroups
     */
    public inputSecurityGroups: string[] | undefined;

    /**
     * Settings that apply only if the input is a MediaConnect input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-mediaconnectflows
     */
    public mediaConnectFlows: Array<CfnInput.MediaConnectFlowRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A name for the input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-name
     */
    public name: string | undefined;

    /**
     * The IAM role for MediaLive to assume when creating a MediaConnect input or Amazon VPC input. This doesn't apply to other types of inputs. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-rolearn
     */
    public roleArn: string | undefined;

    /**
     * Settings that apply only if the input is a pull type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-sources
     */
    public sources: Array<CfnInput.InputSourceRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * A collection of tags for this input. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type for this input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-type
     */
    public type: string | undefined;

    /**
     * Settings that apply only if the input is an push input where the source is on Amazon VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-vpc
     */
    public vpc: CfnInput.InputVpcRequestProperty | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::MediaLive::Input`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInputProps = {}) {
        super(scope, id, { type: CfnInput.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrDestinations = cdk.Token.asList(this.getAtt('Destinations', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrSources = cdk.Token.asList(this.getAtt('Sources', cdk.ResolutionTypeHint.STRING_LIST));

        this.destinations = props.destinations;
        this.inputDevices = props.inputDevices;
        this.inputSecurityGroups = props.inputSecurityGroups;
        this.mediaConnectFlows = props.mediaConnectFlows;
        this.name = props.name;
        this.roleArn = props.roleArn;
        this.sources = props.sources;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MediaLive::Input", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
        this.vpc = props.vpc;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInput.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            destinations: this.destinations,
            inputDevices: this.inputDevices,
            inputSecurityGroups: this.inputSecurityGroups,
            mediaConnectFlows: this.mediaConnectFlows,
            name: this.name,
            roleArn: this.roleArn,
            sources: this.sources,
            tags: this.tags.renderTags(),
            type: this.type,
            vpc: this.vpc,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInputPropsToCloudFormation(props);
    }
}

export namespace CfnInput {
    /**
     * Settings that apply only if the input is a push type of input.
     *
     * The parent of this entity is Input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdestinationrequest.html
     */
    export interface InputDestinationRequestProperty {
        /**
         * The stream name (application name/application instance) for the location the RTMP source content will be pushed to in MediaLive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdestinationrequest.html#cfn-medialive-input-inputdestinationrequest-streamname
         */
        readonly streamName?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputDestinationRequestProperty`
 *
 * @param properties - the TypeScript properties of a `InputDestinationRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_InputDestinationRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('streamName', cdk.validateString)(properties.streamName));
    return errors.wrap('supplied properties not correct for "InputDestinationRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDestinationRequest` resource
 *
 * @param properties - the TypeScript properties of a `InputDestinationRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDestinationRequest` resource.
 */
// @ts-ignore TS6133
function cfnInputInputDestinationRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_InputDestinationRequestPropertyValidator(properties).assertSuccess();
    return {
        StreamName: cdk.stringToCloudFormation(properties.streamName),
    };
}

// @ts-ignore TS6133
function CfnInputInputDestinationRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputDestinationRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputDestinationRequestProperty>();
    ret.addPropertyResult('streamName', 'StreamName', properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInput {
    /**
     * This entity is not used. Ignore it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicerequest.html
     */
    export interface InputDeviceRequestProperty {
        /**
         * This property is not used. Ignore it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicerequest.html#cfn-medialive-input-inputdevicerequest-id
         */
        readonly id?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputDeviceRequestProperty`
 *
 * @param properties - the TypeScript properties of a `InputDeviceRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_InputDeviceRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "InputDeviceRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDeviceRequest` resource
 *
 * @param properties - the TypeScript properties of a `InputDeviceRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDeviceRequest` resource.
 */
// @ts-ignore TS6133
function cfnInputInputDeviceRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_InputDeviceRequestPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnInputInputDeviceRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputDeviceRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputDeviceRequestProperty>();
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInput {
    /**
     * Settings that apply only if the input is an Elemental Link input.
     *
     * The parent of this entity is Input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicesettings.html
     */
    export interface InputDeviceSettingsProperty {
        /**
         * The unique ID for the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicesettings.html#cfn-medialive-input-inputdevicesettings-id
         */
        readonly id?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputDeviceSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `InputDeviceSettingsProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_InputDeviceSettingsPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    return errors.wrap('supplied properties not correct for "InputDeviceSettingsProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDeviceSettings` resource
 *
 * @param properties - the TypeScript properties of a `InputDeviceSettingsProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputDeviceSettings` resource.
 */
// @ts-ignore TS6133
function cfnInputInputDeviceSettingsPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_InputDeviceSettingsPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
    };
}

// @ts-ignore TS6133
function CfnInputInputDeviceSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputDeviceSettingsProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputDeviceSettingsProperty>();
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInput {
    /**
     * Settings that apply only if the input is a pull type of input.
     *
     * The parent of this entity is Input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputsourcerequest.html
     */
    export interface InputSourceRequestProperty {
        /**
         * The password parameter that holds the password for accessing the upstream system. The password parameter applies only if the upstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputsourcerequest.html#cfn-medialive-input-inputsourcerequest-passwordparam
         */
        readonly passwordParam?: string;
        /**
         * For a pull input, the URL where MediaLive pulls the source content from.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputsourcerequest.html#cfn-medialive-input-inputsourcerequest-url
         */
        readonly url?: string;
        /**
         * The user name to connect to the upstream system. The user name applies only if the upstream system requires credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputsourcerequest.html#cfn-medialive-input-inputsourcerequest-username
         */
        readonly username?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputSourceRequestProperty`
 *
 * @param properties - the TypeScript properties of a `InputSourceRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_InputSourceRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('passwordParam', cdk.validateString)(properties.passwordParam));
    errors.collect(cdk.propertyValidator('url', cdk.validateString)(properties.url));
    errors.collect(cdk.propertyValidator('username', cdk.validateString)(properties.username));
    return errors.wrap('supplied properties not correct for "InputSourceRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputSourceRequest` resource
 *
 * @param properties - the TypeScript properties of a `InputSourceRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputSourceRequest` resource.
 */
// @ts-ignore TS6133
function cfnInputInputSourceRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_InputSourceRequestPropertyValidator(properties).assertSuccess();
    return {
        PasswordParam: cdk.stringToCloudFormation(properties.passwordParam),
        Url: cdk.stringToCloudFormation(properties.url),
        Username: cdk.stringToCloudFormation(properties.username),
    };
}

// @ts-ignore TS6133
function CfnInputInputSourceRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputSourceRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputSourceRequestProperty>();
    ret.addPropertyResult('passwordParam', 'PasswordParam', properties.PasswordParam != null ? cfn_parse.FromCloudFormation.getString(properties.PasswordParam) : undefined);
    ret.addPropertyResult('url', 'Url', properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined);
    ret.addPropertyResult('username', 'Username', properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInput {
    /**
     * Settings that apply only if the input is an push input where the source is on Amazon VPC.
     *
     * The parent of this entity is Input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputvpcrequest.html
     */
    export interface InputVpcRequestProperty {
        /**
         * The list of up to five VPC security group IDs to attach to the input VPC network interfaces. The security groups require subnet IDs. If none are specified, MediaLive uses the VPC default security group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputvpcrequest.html#cfn-medialive-input-inputvpcrequest-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The list of two VPC subnet IDs from the same VPC. You must associate subnet IDs to two unique Availability Zones.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputvpcrequest.html#cfn-medialive-input-inputvpcrequest-subnetids
         */
        readonly subnetIds?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `InputVpcRequestProperty`
 *
 * @param properties - the TypeScript properties of a `InputVpcRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_InputVpcRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "InputVpcRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputVpcRequest` resource
 *
 * @param properties - the TypeScript properties of a `InputVpcRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.InputVpcRequest` resource.
 */
// @ts-ignore TS6133
function cfnInputInputVpcRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_InputVpcRequestPropertyValidator(properties).assertSuccess();
    return {
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnInputInputVpcRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.InputVpcRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.InputVpcRequestProperty>();
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnInput {
    /**
     * Settings that apply only if the input is a MediaConnect input.
     *
     * The parent of this entity is Input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-mediaconnectflowrequest.html
     */
    export interface MediaConnectFlowRequestProperty {
        /**
         * The ARN of one or two MediaConnect flows that are the sources for this MediaConnect input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-mediaconnectflowrequest.html#cfn-medialive-input-mediaconnectflowrequest-flowarn
         */
        readonly flowArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `MediaConnectFlowRequestProperty`
 *
 * @param properties - the TypeScript properties of a `MediaConnectFlowRequestProperty`
 *
 * @returns the result of the validation.
 */
function CfnInput_MediaConnectFlowRequestPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('flowArn', cdk.validateString)(properties.flowArn));
    return errors.wrap('supplied properties not correct for "MediaConnectFlowRequestProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::Input.MediaConnectFlowRequest` resource
 *
 * @param properties - the TypeScript properties of a `MediaConnectFlowRequestProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::Input.MediaConnectFlowRequest` resource.
 */
// @ts-ignore TS6133
function cfnInputMediaConnectFlowRequestPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInput_MediaConnectFlowRequestPropertyValidator(properties).assertSuccess();
    return {
        FlowArn: cdk.stringToCloudFormation(properties.flowArn),
    };
}

// @ts-ignore TS6133
function CfnInputMediaConnectFlowRequestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInput.MediaConnectFlowRequestProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInput.MediaConnectFlowRequestProperty>();
    ret.addPropertyResult('flowArn', 'FlowArn', properties.FlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.FlowArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnInputSecurityGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html
 */
export interface CfnInputSecurityGroupProps {

    /**
     * A collection of tags for this input security group. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-tags
     */
    readonly tags?: any;

    /**
     * The list of IPv4 CIDR addresses to include in the input security group as "allowed" addresses.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-whitelistrules
     */
    readonly whitelistRules?: Array<CfnInputSecurityGroup.InputWhitelistRuleCidrProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnInputSecurityGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnInputSecurityGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnInputSecurityGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('whitelistRules', cdk.listValidator(CfnInputSecurityGroup_InputWhitelistRuleCidrPropertyValidator))(properties.whitelistRules));
    return errors.wrap('supplied properties not correct for "CfnInputSecurityGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::InputSecurityGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnInputSecurityGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::InputSecurityGroup` resource.
 */
// @ts-ignore TS6133
function cfnInputSecurityGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInputSecurityGroupPropsValidator(properties).assertSuccess();
    return {
        Tags: cdk.objectToCloudFormation(properties.tags),
        WhitelistRules: cdk.listMapper(cfnInputSecurityGroupInputWhitelistRuleCidrPropertyToCloudFormation)(properties.whitelistRules),
    };
}

// @ts-ignore TS6133
function CfnInputSecurityGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInputSecurityGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInputSecurityGroupProps>();
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('whitelistRules', 'WhitelistRules', properties.WhitelistRules != null ? cfn_parse.FromCloudFormation.getArray(CfnInputSecurityGroupInputWhitelistRuleCidrPropertyFromCloudFormation)(properties.WhitelistRules) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::MediaLive::InputSecurityGroup`
 *
 * The AWS::MediaLive::InputSecurityGroup is a MediaLive resource type that creates an input security group.
 *
 * A MediaLive input security group is associated with a MediaLive input. The input security group is an "allow list" of IP addresses that controls whether an external IP address can push content to the associated MediaLive input.
 *
 * @cloudformationResource AWS::MediaLive::InputSecurityGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html
 */
export class CfnInputSecurityGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::InputSecurityGroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInputSecurityGroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnInputSecurityGroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnInputSecurityGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the MediaLive input security group. For example: arn:aws:medialive:us-west-1:111122223333:medialive:inputSecurityGroup:1234567
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * A collection of tags for this input security group. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The list of IPv4 CIDR addresses to include in the input security group as "allowed" addresses.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-whitelistrules
     */
    public whitelistRules: Array<CfnInputSecurityGroup.InputWhitelistRuleCidrProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::MediaLive::InputSecurityGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInputSecurityGroupProps = {}) {
        super(scope, id, { type: CfnInputSecurityGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MediaLive::InputSecurityGroup", props.tags, { tagPropertyName: 'tags' });
        this.whitelistRules = props.whitelistRules;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnInputSecurityGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            tags: this.tags.renderTags(),
            whitelistRules: this.whitelistRules,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnInputSecurityGroupPropsToCloudFormation(props);
    }
}

export namespace CfnInputSecurityGroup {
    /**
     * An IPv4 CIDR range to include in this input security group.
     *
     * The parent of this entity is InputSecurityGroup.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-inputsecuritygroup-inputwhitelistrulecidr.html
     */
    export interface InputWhitelistRuleCidrProperty {
        /**
         * An IPv4 CIDR range to include in this input security group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-inputsecuritygroup-inputwhitelistrulecidr.html#cfn-medialive-inputsecuritygroup-inputwhitelistrulecidr-cidr
         */
        readonly cidr?: string;
    }
}

/**
 * Determine whether the given properties match those of a `InputWhitelistRuleCidrProperty`
 *
 * @param properties - the TypeScript properties of a `InputWhitelistRuleCidrProperty`
 *
 * @returns the result of the validation.
 */
function CfnInputSecurityGroup_InputWhitelistRuleCidrPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cidr', cdk.validateString)(properties.cidr));
    return errors.wrap('supplied properties not correct for "InputWhitelistRuleCidrProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::MediaLive::InputSecurityGroup.InputWhitelistRuleCidr` resource
 *
 * @param properties - the TypeScript properties of a `InputWhitelistRuleCidrProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::MediaLive::InputSecurityGroup.InputWhitelistRuleCidr` resource.
 */
// @ts-ignore TS6133
function cfnInputSecurityGroupInputWhitelistRuleCidrPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnInputSecurityGroup_InputWhitelistRuleCidrPropertyValidator(properties).assertSuccess();
    return {
        Cidr: cdk.stringToCloudFormation(properties.cidr),
    };
}

// @ts-ignore TS6133
function CfnInputSecurityGroupInputWhitelistRuleCidrPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInputSecurityGroup.InputWhitelistRuleCidrProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInputSecurityGroup.InputWhitelistRuleCidrProperty>();
    ret.addPropertyResult('cidr', 'Cidr', properties.Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.Cidr) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
