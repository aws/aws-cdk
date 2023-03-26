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
export declare class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::Channel";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel;
    /**
     * The ARN of the MediaLive channel. For example: arn:aws:medialive:us-west-1:111122223333:medialive:channel:1234567
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The inputs that are attached to this channel. The inputs are identified by their IDs (not by their names or their ARNs).
     * @cloudformationAttribute Inputs
     */
    readonly attrInputs: string[];
    /**
     * Specification of CDI inputs for this channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-cdiinputspecification
     */
    cdiInputSpecification: CfnChannel.CdiInputSpecificationProperty | cdk.IResolvable | undefined;
    /**
     * The class for this channel. For a channel with two pipelines, the class is STANDARD. For a channel with one pipeline, the class is SINGLE_PIPELINE.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-channelclass
     */
    channelClass: string | undefined;
    /**
     * The settings that identify the destination for the outputs in this MediaLive output package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-destinations
     */
    destinations: Array<CfnChannel.OutputDestinationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The encoding configuration for the output content.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-encodersettings
     */
    encoderSettings: CfnChannel.EncoderSettingsProperty | cdk.IResolvable | undefined;
    /**
     * The list of input attachments for the channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputattachments
     */
    inputAttachments: Array<CfnChannel.InputAttachmentProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The input specification for this channel. It specifies the key characteristics of the inputs for this channel: the maximum bitrate, the resolution, and the codec.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-inputspecification
     */
    inputSpecification: CfnChannel.InputSpecificationProperty | cdk.IResolvable | undefined;
    /**
     * The verbosity for logging activity for this channel. Charges for logging (which are generated through Amazon CloudWatch Logging) are higher for higher verbosities.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-loglevel
     */
    logLevel: string | undefined;
    /**
     * A name for this audio selector. The AudioDescription (in an output) references this name in order to identify a specific input audio to include in that output.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-name
     */
    name: string | undefined;
    /**
     * The IAM role for MediaLive to assume when running this channel. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-rolearn
     */
    roleArn: string | undefined;
    /**
     * A collection of tags for this channel. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Settings to enable VPC mode in the channel, so that the endpoints for all outputs are in your VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-channel.html#cfn-medialive-channel-vpc
     */
    vpc: CfnChannel.VpcOutputSettingsProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::MediaLive::Channel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnChannelProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnChannel {
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
    interface AacSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Ac3SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AncillarySourceSettingsProperty {
        /**
         * Specifies the number (1 to 4) of the captions channel you want to extract from the ancillary captions. If you plan to convert the ancillary captions to another format, complete this field. If you plan to choose Embedded as the captions destination in the output (to pass through all the channels in the ancillary captions), leave this field blank because MediaLive ignores the field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ancillarysourcesettings.html#cfn-medialive-channel-ancillarysourcesettings-sourceancillarychannelnumber
         */
        readonly sourceAncillaryChannelNumber?: number;
    }
}
export declare namespace CfnChannel {
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
    interface ArchiveCdnSettingsProperty {
        /**
         * Sets up Amazon S3 as the destination for this Archive output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archivecdnsettings.html#cfn-medialive-channel-archivecdnsettings-archives3settings
         */
        readonly archiveS3Settings?: CfnChannel.ArchiveS3SettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface ArchiveContainerSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface ArchiveGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface ArchiveOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface ArchiveS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-archives3settings.html#cfn-medialive-channel-archives3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}
export declare namespace CfnChannel {
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
    interface AribDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface AribSourceSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface AudioChannelMappingProperty {
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
export declare namespace CfnChannel {
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
    interface AudioCodecSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AudioDescriptionProperty {
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
export declare namespace CfnChannel {
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
    interface AudioHlsRenditionSelectionProperty {
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
export declare namespace CfnChannel {
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
    interface AudioLanguageSelectionProperty {
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
export declare namespace CfnChannel {
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
    interface AudioNormalizationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AudioOnlyHlsSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AudioPidSelectionProperty {
        /**
         * Select the audio by this PID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiopidselection.html#cfn-medialive-channel-audiopidselection-pid
         */
        readonly pid?: number;
    }
}
export declare namespace CfnChannel {
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
    interface AudioSelectorProperty {
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
export declare namespace CfnChannel {
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
    interface AudioSelectorSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AudioSilenceFailoverSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AudioTrackProperty {
        /**
         * 1-based integer value that maps to a specific audio track
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrack.html#cfn-medialive-channel-audiotrack-track
         */
        readonly track?: number;
    }
}
export declare namespace CfnChannel {
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
    interface AudioTrackSelectionProperty {
        /**
         * Selects one or more unique audio tracks from within a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiotrackselection.html#cfn-medialive-channel-audiotrackselection-tracks
         */
        readonly tracks?: Array<CfnChannel.AudioTrackProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface AudioWatermarkSettingsProperty {
        /**
         * Settings to configure Nielsen Watermarks in the audio encode
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-audiowatermarksettings.html#cfn-medialive-channel-audiowatermarksettings-nielsenwatermarkssettings
         */
        readonly nielsenWatermarksSettings?: CfnChannel.NielsenWatermarksSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface AutomaticInputFailoverSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface AvailBlankingProperty {
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
export declare namespace CfnChannel {
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
    interface AvailConfigurationProperty {
        /**
         * The setup of ad avail handling in the output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-availconfiguration.html#cfn-medialive-channel-availconfiguration-availsettings
         */
        readonly availSettings?: CfnChannel.AvailSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface AvailSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface BlackoutSlateProperty {
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
export declare namespace CfnChannel {
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
    interface BurnInDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionDescriptionProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionLanguageMappingProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionRectangleProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionSelectorProperty {
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
export declare namespace CfnChannel {
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
    interface CaptionSelectorSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface CdiInputSpecificationProperty {
        /**
         * Maximum CDI input resolution
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-cdiinputspecification.html#cfn-medialive-channel-cdiinputspecification-resolution
         */
        readonly resolution?: string;
    }
}
export declare namespace CfnChannel {
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
    interface ColorSpacePassthroughSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface DvbNitSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface DvbSdtSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface DvbSubDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface DvbSubSourceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface DvbTdtSettingsProperty {
        /**
         * The number of milliseconds between instances of this table in the output transport stream.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-dvbtdtsettings.html#cfn-medialive-channel-dvbtdtsettings-repinterval
         */
        readonly repInterval?: number;
    }
}
export declare namespace CfnChannel {
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
    interface Eac3SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface EbuTtDDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface EmbeddedDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface EmbeddedPlusScte20DestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface EmbeddedSourceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface EncoderSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface FailoverConditionProperty {
        /**
         * Settings for a specific failover condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-failovercondition.html#cfn-medialive-channel-failovercondition-failoverconditionsettings
         */
        readonly failoverConditionSettings?: CfnChannel.FailoverConditionSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface FailoverConditionSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface FeatureActivationsProperty {
        /**
         * Enables the Input Prepare feature. You can create Input Prepare actions in the schedule only if this feature is enabled.
         * If you disable the feature on an existing schedule, make sure that you first delete all input prepare actions from the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-featureactivations.html#cfn-medialive-channel-featureactivations-inputpreparescheduleactions
         */
        readonly inputPrepareScheduleActions?: string;
    }
}
export declare namespace CfnChannel {
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
    interface FecOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Fmp4HlsSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface FrameCaptureCdnSettingsProperty {
        /**
         * Sets up Amazon S3 as the destination for this Frame Capture output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecapturecdnsettings.html#cfn-medialive-channel-framecapturecdnsettings-framecaptures3settings
         */
        readonly frameCaptureS3Settings?: CfnChannel.FrameCaptureS3SettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface FrameCaptureGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface FrameCaptureHlsSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface FrameCaptureOutputSettingsProperty {
        /**
         * Required if the output group contains more than one output. This modifier forms part of the output file name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptureoutputsettings.html#cfn-medialive-channel-framecaptureoutputsettings-namemodifier
         */
        readonly nameModifier?: string;
    }
}
export declare namespace CfnChannel {
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
    interface FrameCaptureS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-framecaptures3settings.html#cfn-medialive-channel-framecaptures3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}
export declare namespace CfnChannel {
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
    interface FrameCaptureSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface GlobalConfigurationProperty {
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
export declare namespace CfnChannel {
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
    interface H264ColorSpaceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface H264FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h264filtersettings.html#cfn-medialive-channel-h264filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface H264SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface H265ColorSpaceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface H265FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-h265filtersettings.html#cfn-medialive-channel-h265filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface H265SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Hdr10SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsAkamaiSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsBasicPutSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsCdnSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsInputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsMediaStoreSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsS3SettingsProperty {
        /**
         * Specify the canned ACL to apply to each S3 request. Defaults to none.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-hlss3settings.html#cfn-medialive-channel-hlss3settings-cannedacl
         */
        readonly cannedAcl?: string;
    }
}
export declare namespace CfnChannel {
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
    interface HlsSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HlsWebdavSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface HtmlMotionGraphicsSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface InputAttachmentProperty {
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
export declare namespace CfnChannel {
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
    interface InputChannelLevelProperty {
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
export declare namespace CfnChannel {
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
    interface InputLocationProperty {
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
export declare namespace CfnChannel {
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
    interface InputLossBehaviorProperty {
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
export declare namespace CfnChannel {
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
    interface InputLossFailoverSettingsProperty {
        /**
         * The amount of time (in milliseconds) that no input is detected. After that time, an input failover will occur.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-inputlossfailoversettings.html#cfn-medialive-channel-inputlossfailoversettings-inputlossthresholdmsec
         */
        readonly inputLossThresholdMsec?: number;
    }
}
export declare namespace CfnChannel {
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
    interface InputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface InputSpecificationProperty {
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
export declare namespace CfnChannel {
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
    interface KeyProviderSettingsProperty {
        /**
         * The configuration of static key settings.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-keyprovidersettings.html#cfn-medialive-channel-keyprovidersettings-statickeysettings
         */
        readonly staticKeySettings?: CfnChannel.StaticKeySettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface M2tsSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface M3u8SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface MediaPackageGroupSettingsProperty {
        /**
         * The MediaPackage channel destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackagegroupsettings.html#cfn-medialive-channel-mediapackagegroupsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface MediaPackageOutputDestinationSettingsProperty {
        /**
         * The ID of the channel in MediaPackage that is the destination for this output group. You don't need to specify the individual inputs in MediaPackage; MediaLive handles the connection of the two MediaLive pipelines to the two MediaPackage inputs. The MediaPackage channel and MediaLive channel must be in the same Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mediapackageoutputdestinationsettings.html#cfn-medialive-channel-mediapackageoutputdestinationsettings-channelid
         */
        readonly channelId?: string;
    }
}
export declare namespace CfnChannel {
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
    interface MediaPackageOutputSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface MotionGraphicsConfigurationProperty {
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
export declare namespace CfnChannel {
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
    interface MotionGraphicsSettingsProperty {
        /**
         * Settings to configure the motion graphics overlay to use an HTML asset.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-motiongraphicssettings.html#cfn-medialive-channel-motiongraphicssettings-htmlmotiongraphicssettings
         */
        readonly htmlMotionGraphicsSettings?: CfnChannel.HtmlMotionGraphicsSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface Mp2SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Mpeg2FilterSettingsProperty {
        /**
         * Settings for applying the temporal filter to the video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-mpeg2filtersettings.html#cfn-medialive-channel-mpeg2filtersettings-temporalfiltersettings
         */
        readonly temporalFilterSettings?: CfnChannel.TemporalFilterSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface Mpeg2SettingsProperty {
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
export declare namespace CfnChannel {
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
    interface MsSmoothGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface MsSmoothOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface MultiplexGroupSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface MultiplexOutputSettingsProperty {
        /**
         * Destination is a Multiplex.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-multiplexoutputsettings.html#cfn-medialive-channel-multiplexoutputsettings-destination
         */
        readonly destination?: CfnChannel.OutputLocationRefProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface MultiplexProgramChannelDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface NetworkInputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface NielsenCBETProperty {
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
export declare namespace CfnChannel {
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
    interface NielsenConfigurationProperty {
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
export declare namespace CfnChannel {
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
    interface NielsenNaesIiNwProperty {
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
export declare namespace CfnChannel {
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
    interface NielsenWatermarksSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface OutputProperty {
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
export declare namespace CfnChannel {
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
    interface OutputDestinationProperty {
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
export declare namespace CfnChannel {
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
    interface OutputDestinationSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface OutputGroupProperty {
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
export declare namespace CfnChannel {
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
    interface OutputGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface OutputLocationRefProperty {
        /**
         * A reference ID for this destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-outputlocationref.html#cfn-medialive-channel-outputlocationref-destinationrefid
         */
        readonly destinationRefId?: string;
    }
}
export declare namespace CfnChannel {
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
    interface OutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface PassThroughSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface RawSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface Rec601SettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface Rec709SettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface RemixSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface RtmpCaptionInfoDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface RtmpGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface RtmpOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Scte20PlusEmbeddedDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface Scte20SourceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Scte27DestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface Scte27SourceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface Scte35SpliceInsertProperty {
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
export declare namespace CfnChannel {
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
    interface Scte35TimeSignalAposProperty {
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
export declare namespace CfnChannel {
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
    interface SmpteTtDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface StandardHlsSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface StaticKeySettingsProperty {
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
export declare namespace CfnChannel {
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
    interface TeletextDestinationSettingsProperty {
    }
}
export declare namespace CfnChannel {
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
    interface TeletextSourceSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface TemporalFilterSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface TimecodeConfigProperty {
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
export declare namespace CfnChannel {
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
    interface TtmlDestinationSettingsProperty {
        /**
         * When set to passthrough, passes through style and position information from a TTML-like input source (TTML, SMPTE-TT, CFF-TT) to the CFF-TT output or TTML output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-ttmldestinationsettings.html#cfn-medialive-channel-ttmldestinationsettings-stylecontrol
         */
        readonly styleControl?: string;
    }
}
export declare namespace CfnChannel {
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
    interface UdpContainerSettingsProperty {
        /**
         * The M2TS configuration for this UDP output.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-udpcontainersettings.html#cfn-medialive-channel-udpcontainersettings-m2tssettings
         */
        readonly m2TsSettings?: CfnChannel.M2tsSettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface UdpGroupSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface UdpOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface VideoBlackFailoverSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface VideoCodecSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface VideoDescriptionProperty {
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
export declare namespace CfnChannel {
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
    interface VideoSelectorProperty {
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
export declare namespace CfnChannel {
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
    interface VideoSelectorColorSpaceSettingsProperty {
        /**
         * Settings to configure color space settings in the incoming video.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorcolorspacesettings.html#cfn-medialive-channel-videoselectorcolorspacesettings-hdr10settings
         */
        readonly hdr10Settings?: CfnChannel.Hdr10SettingsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnChannel {
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
    interface VideoSelectorPidProperty {
        /**
         * Selects a specific PID from within a video source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorpid.html#cfn-medialive-channel-videoselectorpid-pid
         */
        readonly pid?: number;
    }
}
export declare namespace CfnChannel {
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
    interface VideoSelectorProgramIdProperty {
        /**
         * Selects a specific program from within a multi-program transport stream. If the program doesn't exist, MediaLive selects the first program within the transport stream by default.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-videoselectorprogramid.html#cfn-medialive-channel-videoselectorprogramid-programid
         */
        readonly programId?: number;
    }
}
export declare namespace CfnChannel {
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
    interface VideoSelectorSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface VpcOutputSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface WavSettingsProperty {
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
export declare namespace CfnChannel {
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
    interface WebvttDestinationSettingsProperty {
        /**
         * Controls whether the color and position of the source captions is passed through to the WebVTT output captions. PASSTHROUGH - Valid only if the source captions are EMBEDDED or TELETEXT. NO_STYLE_DATA - Don't pass through the style. The output captions will not contain any font styling information.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-channel-webvttdestinationsettings.html#cfn-medialive-channel-webvttdestinationsettings-stylecontrol
         */
        readonly styleControl?: string;
    }
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
export declare class CfnInput extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::Input";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInput;
    /**
     * The ARN of the MediaLive input. For example: arn:aws:medialive:us-west-1:111122223333:medialive:input:1234567. MediaLive creates this ARN when it creates the input.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * For a push input, the the destination or destinations for the input. The destinations are the URLs of locations on MediaLive where the upstream system pushes the content to, for this input. MediaLive creates these addresses when it creates the input.
     * @cloudformationAttribute Destinations
     */
    readonly attrDestinations: string[];
    /**
     * For a pull input, the source or sources for the input. The sources are the URLs of locations on the upstream system where MediaLive pulls the content from, for this input. You included these URLs in the create request.
     * @cloudformationAttribute Sources
     */
    readonly attrSources: string[];
    /**
     * Settings that apply only if the input is a push type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-destinations
     */
    destinations: Array<CfnInput.InputDestinationRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Settings that apply only if the input is an Elemental Link input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputdevices
     */
    inputDevices: Array<CfnInput.InputDeviceSettingsProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The list of input security groups (referenced by IDs) to attach to the input if the input is a push type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-inputsecuritygroups
     */
    inputSecurityGroups: string[] | undefined;
    /**
     * Settings that apply only if the input is a MediaConnect input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-mediaconnectflows
     */
    mediaConnectFlows: Array<CfnInput.MediaConnectFlowRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A name for the input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-name
     */
    name: string | undefined;
    /**
     * The IAM role for MediaLive to assume when creating a MediaConnect input or Amazon VPC input. This doesn't apply to other types of inputs. The role is identified by its ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-rolearn
     */
    roleArn: string | undefined;
    /**
     * Settings that apply only if the input is a pull type of input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-sources
     */
    sources: Array<CfnInput.InputSourceRequestProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A collection of tags for this input. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The type for this input.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-type
     */
    type: string | undefined;
    /**
     * Settings that apply only if the input is an push input where the source is on Amazon VPC.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-input.html#cfn-medialive-input-vpc
     */
    vpc: CfnInput.InputVpcRequestProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::MediaLive::Input`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnInputProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnInput {
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
    interface InputDestinationRequestProperty {
        /**
         * The stream name (application name/application instance) for the location the RTMP source content will be pushed to in MediaLive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdestinationrequest.html#cfn-medialive-input-inputdestinationrequest-streamname
         */
        readonly streamName?: string;
    }
}
export declare namespace CfnInput {
    /**
     * This entity is not used. Ignore it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicerequest.html
     */
    interface InputDeviceRequestProperty {
        /**
         * This property is not used. Ignore it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicerequest.html#cfn-medialive-input-inputdevicerequest-id
         */
        readonly id?: string;
    }
}
export declare namespace CfnInput {
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
    interface InputDeviceSettingsProperty {
        /**
         * The unique ID for the device.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-inputdevicesettings.html#cfn-medialive-input-inputdevicesettings-id
         */
        readonly id?: string;
    }
}
export declare namespace CfnInput {
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
    interface InputSourceRequestProperty {
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
export declare namespace CfnInput {
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
    interface InputVpcRequestProperty {
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
export declare namespace CfnInput {
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
    interface MediaConnectFlowRequestProperty {
        /**
         * The ARN of one or two MediaConnect flows that are the sources for this MediaConnect input.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-input-mediaconnectflowrequest.html#cfn-medialive-input-mediaconnectflowrequest-flowarn
         */
        readonly flowArn?: string;
    }
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
export declare class CfnInputSecurityGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::MediaLive::InputSecurityGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInputSecurityGroup;
    /**
     * The ARN of the MediaLive input security group. For example: arn:aws:medialive:us-west-1:111122223333:medialive:inputSecurityGroup:1234567
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * A collection of tags for this input security group. Each tag is a key-value pair.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The list of IPv4 CIDR addresses to include in the input security group as "allowed" addresses.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-medialive-inputsecuritygroup.html#cfn-medialive-inputsecuritygroup-whitelistrules
     */
    whitelistRules: Array<CfnInputSecurityGroup.InputWhitelistRuleCidrProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::MediaLive::InputSecurityGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnInputSecurityGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnInputSecurityGroup {
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
    interface InputWhitelistRuleCidrProperty {
        /**
         * An IPv4 CIDR range to include in this input security group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-medialive-inputsecuritygroup-inputwhitelistrulecidr.html#cfn-medialive-inputsecuritygroup-inputwhitelistrulecidr-cidr
         */
        readonly cidr?: string;
    }
}
