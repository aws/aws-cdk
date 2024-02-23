/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The configuration parameters for a channel.
 *
 * For information about MediaTailor channels, see [Working with channels](https://docs.aws.amazon.com/mediatailor/latest/ug/channel-assembly-channels.html) in the *MediaTailor User Guide* .
 *
 * @cloudformationResource AWS::MediaTailor::Channel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::Channel";

  /**
   * Build a CfnChannel from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * <p>The ARN of the channel.</p>
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the channel.
   */
  public channelName: string;

  /**
   * The slate used to fill gaps between programs in the schedule.
   */
  public fillerSlate?: cdk.IResolvable | CfnChannel.SlateSourceProperty;

  /**
   * The log configuration.
   */
  public logConfiguration?: cdk.IResolvable | CfnChannel.LogConfigurationForChannelProperty;

  /**
   * The channel's output properties.
   */
  public outputs: Array<cdk.IResolvable | CfnChannel.RequestOutputItemProperty> | cdk.IResolvable;

  /**
   * The type of playback mode for this channel.
   */
  public playbackMode: string;

  /**
   * The tags to assign to the channel.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The tier for this channel.
   */
  public tier?: string;

  /**
   * The configuration for time-shifted viewing.
   */
  public timeShiftConfiguration?: cdk.IResolvable | CfnChannel.TimeShiftConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelProps) {
    super(scope, id, {
      "type": CfnChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "channelName", this);
    cdk.requireProperty(props, "outputs", this);
    cdk.requireProperty(props, "playbackMode", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.channelName = props.channelName;
    this.fillerSlate = props.fillerSlate;
    this.logConfiguration = props.logConfiguration;
    this.outputs = props.outputs;
    this.playbackMode = props.playbackMode;
    this.tags = props.tags;
    this.tier = props.tier;
    this.timeShiftConfiguration = props.timeShiftConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelName": this.channelName,
      "fillerSlate": this.fillerSlate,
      "logConfiguration": this.logConfiguration,
      "outputs": this.outputs,
      "playbackMode": this.playbackMode,
      "tags": this.tags,
      "tier": this.tier,
      "timeShiftConfiguration": this.timeShiftConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnChannelPropsToCloudFormation(props);
  }
}

export namespace CfnChannel {
  /**
   * Slate VOD source configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-slatesource.html
   */
  export interface SlateSourceProperty {
    /**
     * The name of the source location where the slate VOD source is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-slatesource.html#cfn-mediatailor-channel-slatesource-sourcelocationname
     */
    readonly sourceLocationName?: string;

    /**
     * The slate VOD source name.
     *
     * The VOD source must already exist in a source location before it can be used for slate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-slatesource.html#cfn-mediatailor-channel-slatesource-vodsourcename
     */
    readonly vodSourceName?: string;
  }

  /**
   * The output configuration for this channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-requestoutputitem.html
   */
  export interface RequestOutputItemProperty {
    /**
     * DASH manifest configuration parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-requestoutputitem.html#cfn-mediatailor-channel-requestoutputitem-dashplaylistsettings
     */
    readonly dashPlaylistSettings?: CfnChannel.DashPlaylistSettingsProperty | cdk.IResolvable;

    /**
     * HLS playlist configuration parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-requestoutputitem.html#cfn-mediatailor-channel-requestoutputitem-hlsplaylistsettings
     */
    readonly hlsPlaylistSettings?: CfnChannel.HlsPlaylistSettingsProperty | cdk.IResolvable;

    /**
     * The name of the manifest for the channel.
     *
     * The name appears in the `PlaybackUrl` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-requestoutputitem.html#cfn-mediatailor-channel-requestoutputitem-manifestname
     */
    readonly manifestName: string;

    /**
     * A string used to match which `HttpPackageConfiguration` is used for each `VodSource` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-requestoutputitem.html#cfn-mediatailor-channel-requestoutputitem-sourcegroup
     */
    readonly sourceGroup: string;
  }

  /**
   * Dash manifest configuration parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-dashplaylistsettings.html
   */
  export interface DashPlaylistSettingsProperty {
    /**
     * The total duration (in seconds) of each manifest.
     *
     * Minimum value: `30` seconds. Maximum value: `3600` seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-dashplaylistsettings.html#cfn-mediatailor-channel-dashplaylistsettings-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;

    /**
     * Minimum amount of content (measured in seconds) that a player must keep available in the buffer.
     *
     * Minimum value: `2` seconds. Maximum value: `60` seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-dashplaylistsettings.html#cfn-mediatailor-channel-dashplaylistsettings-minbuffertimeseconds
     */
    readonly minBufferTimeSeconds?: number;

    /**
     * Minimum amount of time (in seconds) that the player should wait before requesting updates to the manifest.
     *
     * Minimum value: `2` seconds. Maximum value: `60` seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-dashplaylistsettings.html#cfn-mediatailor-channel-dashplaylistsettings-minupdateperiodseconds
     */
    readonly minUpdatePeriodSeconds?: number;

    /**
     * Amount of time (in seconds) that the player should be from the live point at the end of the manifest.
     *
     * Minimum value: `2` seconds. Maximum value: `60` seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-dashplaylistsettings.html#cfn-mediatailor-channel-dashplaylistsettings-suggestedpresentationdelayseconds
     */
    readonly suggestedPresentationDelaySeconds?: number;
  }

  /**
   * HLS playlist configuration parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-hlsplaylistsettings.html
   */
  export interface HlsPlaylistSettingsProperty {
    /**
     * Determines the type of SCTE 35 tags to use in ad markup.
     *
     * Specify `DATERANGE` to use `DATERANGE` tags (for live or VOD content). Specify `SCTE35_ENHANCED` to use `EXT-X-CUE-OUT` and `EXT-X-CUE-IN` tags (for VOD content only).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-hlsplaylistsettings.html#cfn-mediatailor-channel-hlsplaylistsettings-admarkuptype
     */
    readonly adMarkupType?: Array<string>;

    /**
     * The total duration (in seconds) of each manifest.
     *
     * Minimum value: `30` seconds. Maximum value: `3600` seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-hlsplaylistsettings.html#cfn-mediatailor-channel-hlsplaylistsettings-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;
  }

  /**
   * The log configuration for the channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-logconfigurationforchannel.html
   */
  export interface LogConfigurationForChannelProperty {
    /**
     * The log types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-logconfigurationforchannel.html#cfn-mediatailor-channel-logconfigurationforchannel-logtypes
     */
    readonly logTypes?: Array<string>;
  }

  /**
   * The configuration for time-shifted viewing.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-timeshiftconfiguration.html
   */
  export interface TimeShiftConfigurationProperty {
    /**
     * The maximum time delay for time-shifted viewing.
     *
     * The minimum allowed maximum time delay is 0 seconds, and the maximum allowed maximum time delay is 21600 seconds (6 hours).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-channel-timeshiftconfiguration.html#cfn-mediatailor-channel-timeshiftconfiguration-maxtimedelayseconds
     */
    readonly maxTimeDelaySeconds: number;
  }
}

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html
 */
export interface CfnChannelProps {
  /**
   * The name of the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-channelname
   */
  readonly channelName: string;

  /**
   * The slate used to fill gaps between programs in the schedule.
   *
   * You must configure filler slate if your channel uses the `LINEAR` `PlaybackMode` . MediaTailor doesn't support filler slate for channels using the `LOOP` `PlaybackMode` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-fillerslate
   */
  readonly fillerSlate?: cdk.IResolvable | CfnChannel.SlateSourceProperty;

  /**
   * The log configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-logconfiguration
   */
  readonly logConfiguration?: cdk.IResolvable | CfnChannel.LogConfigurationForChannelProperty;

  /**
   * The channel's output properties.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-outputs
   */
  readonly outputs: Array<cdk.IResolvable | CfnChannel.RequestOutputItemProperty> | cdk.IResolvable;

  /**
   * The type of playback mode for this channel.
   *
   * `LINEAR` - Programs play back-to-back only once.
   *
   * `LOOP` - Programs play back-to-back in an endless loop. When the last program in the schedule plays, playback loops back to the first program in the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-playbackmode
   */
  readonly playbackMode: string;

  /**
   * The tags to assign to the channel.
   *
   * Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see [Tagging AWS Elemental MediaTailor Resources](https://docs.aws.amazon.com/mediatailor/latest/ug/tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The tier for this channel.
   *
   * STANDARD tier channels can contain live programs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-tier
   */
  readonly tier?: string;

  /**
   * The configuration for time-shifted viewing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channel.html#cfn-mediatailor-channel-timeshiftconfiguration
   */
  readonly timeShiftConfiguration?: cdk.IResolvable | CfnChannel.TimeShiftConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `SlateSourceProperty`
 *
 * @param properties - the TypeScript properties of a `SlateSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelSlateSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.validateString)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("vodSourceName", cdk.validateString)(properties.vodSourceName));
  return errors.wrap("supplied properties not correct for \"SlateSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelSlateSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelSlateSourcePropertyValidator(properties).assertSuccess();
  return {
    "SourceLocationName": cdk.stringToCloudFormation(properties.sourceLocationName),
    "VodSourceName": cdk.stringToCloudFormation(properties.vodSourceName)
  };
}

// @ts-ignore TS6133
function CfnChannelSlateSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.SlateSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.SlateSourceProperty>();
  ret.addPropertyResult("sourceLocationName", "SourceLocationName", (properties.SourceLocationName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationName) : undefined));
  ret.addPropertyResult("vodSourceName", "VodSourceName", (properties.VodSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.VodSourceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashPlaylistSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `DashPlaylistSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelDashPlaylistSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  errors.collect(cdk.propertyValidator("minBufferTimeSeconds", cdk.validateNumber)(properties.minBufferTimeSeconds));
  errors.collect(cdk.propertyValidator("minUpdatePeriodSeconds", cdk.validateNumber)(properties.minUpdatePeriodSeconds));
  errors.collect(cdk.propertyValidator("suggestedPresentationDelaySeconds", cdk.validateNumber)(properties.suggestedPresentationDelaySeconds));
  return errors.wrap("supplied properties not correct for \"DashPlaylistSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelDashPlaylistSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelDashPlaylistSettingsPropertyValidator(properties).assertSuccess();
  return {
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds),
    "MinBufferTimeSeconds": cdk.numberToCloudFormation(properties.minBufferTimeSeconds),
    "MinUpdatePeriodSeconds": cdk.numberToCloudFormation(properties.minUpdatePeriodSeconds),
    "SuggestedPresentationDelaySeconds": cdk.numberToCloudFormation(properties.suggestedPresentationDelaySeconds)
  };
}

// @ts-ignore TS6133
function CfnChannelDashPlaylistSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.DashPlaylistSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.DashPlaylistSettingsProperty>();
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addPropertyResult("minBufferTimeSeconds", "MinBufferTimeSeconds", (properties.MinBufferTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinBufferTimeSeconds) : undefined));
  ret.addPropertyResult("minUpdatePeriodSeconds", "MinUpdatePeriodSeconds", (properties.MinUpdatePeriodSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinUpdatePeriodSeconds) : undefined));
  ret.addPropertyResult("suggestedPresentationDelaySeconds", "SuggestedPresentationDelaySeconds", (properties.SuggestedPresentationDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SuggestedPresentationDelaySeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsPlaylistSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `HlsPlaylistSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelHlsPlaylistSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkupType", cdk.listValidator(cdk.validateString))(properties.adMarkupType));
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  return errors.wrap("supplied properties not correct for \"HlsPlaylistSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelHlsPlaylistSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelHlsPlaylistSettingsPropertyValidator(properties).assertSuccess();
  return {
    "AdMarkupType": cdk.listMapper(cdk.stringToCloudFormation)(properties.adMarkupType),
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds)
  };
}

// @ts-ignore TS6133
function CfnChannelHlsPlaylistSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsPlaylistSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsPlaylistSettingsProperty>();
  ret.addPropertyResult("adMarkupType", "AdMarkupType", (properties.AdMarkupType != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdMarkupType) : undefined));
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequestOutputItemProperty`
 *
 * @param properties - the TypeScript properties of a `RequestOutputItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelRequestOutputItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dashPlaylistSettings", CfnChannelDashPlaylistSettingsPropertyValidator)(properties.dashPlaylistSettings));
  errors.collect(cdk.propertyValidator("hlsPlaylistSettings", CfnChannelHlsPlaylistSettingsPropertyValidator)(properties.hlsPlaylistSettings));
  errors.collect(cdk.propertyValidator("manifestName", cdk.requiredValidator)(properties.manifestName));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.requiredValidator)(properties.sourceGroup));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.validateString)(properties.sourceGroup));
  return errors.wrap("supplied properties not correct for \"RequestOutputItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelRequestOutputItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelRequestOutputItemPropertyValidator(properties).assertSuccess();
  return {
    "DashPlaylistSettings": convertCfnChannelDashPlaylistSettingsPropertyToCloudFormation(properties.dashPlaylistSettings),
    "HlsPlaylistSettings": convertCfnChannelHlsPlaylistSettingsPropertyToCloudFormation(properties.hlsPlaylistSettings),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "SourceGroup": cdk.stringToCloudFormation(properties.sourceGroup)
  };
}

// @ts-ignore TS6133
function CfnChannelRequestOutputItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.RequestOutputItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RequestOutputItemProperty>();
  ret.addPropertyResult("dashPlaylistSettings", "DashPlaylistSettings", (properties.DashPlaylistSettings != null ? CfnChannelDashPlaylistSettingsPropertyFromCloudFormation(properties.DashPlaylistSettings) : undefined));
  ret.addPropertyResult("hlsPlaylistSettings", "HlsPlaylistSettings", (properties.HlsPlaylistSettings != null ? CfnChannelHlsPlaylistSettingsPropertyFromCloudFormation(properties.HlsPlaylistSettings) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("sourceGroup", "SourceGroup", (properties.SourceGroup != null ? cfn_parse.FromCloudFormation.getString(properties.SourceGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationForChannelProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationForChannelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelLogConfigurationForChannelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logTypes", cdk.listValidator(cdk.validateString))(properties.logTypes));
  return errors.wrap("supplied properties not correct for \"LogConfigurationForChannelProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelLogConfigurationForChannelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelLogConfigurationForChannelPropertyValidator(properties).assertSuccess();
  return {
    "LogTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.logTypes)
  };
}

// @ts-ignore TS6133
function CfnChannelLogConfigurationForChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.LogConfigurationForChannelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.LogConfigurationForChannelProperty>();
  ret.addPropertyResult("logTypes", "LogTypes", (properties.LogTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LogTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimeShiftConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TimeShiftConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelTimeShiftConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxTimeDelaySeconds", cdk.requiredValidator)(properties.maxTimeDelaySeconds));
  errors.collect(cdk.propertyValidator("maxTimeDelaySeconds", cdk.validateNumber)(properties.maxTimeDelaySeconds));
  return errors.wrap("supplied properties not correct for \"TimeShiftConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelTimeShiftConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelTimeShiftConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxTimeDelaySeconds": cdk.numberToCloudFormation(properties.maxTimeDelaySeconds)
  };
}

// @ts-ignore TS6133
function CfnChannelTimeShiftConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.TimeShiftConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.TimeShiftConfigurationProperty>();
  ret.addPropertyResult("maxTimeDelaySeconds", "MaxTimeDelaySeconds", (properties.MaxTimeDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTimeDelaySeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelName", cdk.requiredValidator)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("fillerSlate", CfnChannelSlateSourcePropertyValidator)(properties.fillerSlate));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnChannelLogConfigurationForChannelPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("outputs", cdk.requiredValidator)(properties.outputs));
  errors.collect(cdk.propertyValidator("outputs", cdk.listValidator(CfnChannelRequestOutputItemPropertyValidator))(properties.outputs));
  errors.collect(cdk.propertyValidator("playbackMode", cdk.requiredValidator)(properties.playbackMode));
  errors.collect(cdk.propertyValidator("playbackMode", cdk.validateString)(properties.playbackMode));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tier", cdk.validateString)(properties.tier));
  errors.collect(cdk.propertyValidator("timeShiftConfiguration", CfnChannelTimeShiftConfigurationPropertyValidator)(properties.timeShiftConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPropsValidator(properties).assertSuccess();
  return {
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "FillerSlate": convertCfnChannelSlateSourcePropertyToCloudFormation(properties.fillerSlate),
    "LogConfiguration": convertCfnChannelLogConfigurationForChannelPropertyToCloudFormation(properties.logConfiguration),
    "Outputs": cdk.listMapper(convertCfnChannelRequestOutputItemPropertyToCloudFormation)(properties.outputs),
    "PlaybackMode": cdk.stringToCloudFormation(properties.playbackMode),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Tier": cdk.stringToCloudFormation(properties.tier),
    "TimeShiftConfiguration": convertCfnChannelTimeShiftConfigurationPropertyToCloudFormation(properties.timeShiftConfiguration)
  };
}

// @ts-ignore TS6133
function CfnChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelProps>();
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("fillerSlate", "FillerSlate", (properties.FillerSlate != null ? CfnChannelSlateSourcePropertyFromCloudFormation(properties.FillerSlate) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnChannelLogConfigurationForChannelPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("outputs", "Outputs", (properties.Outputs != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelRequestOutputItemPropertyFromCloudFormation)(properties.Outputs) : undefined));
  ret.addPropertyResult("playbackMode", "PlaybackMode", (properties.PlaybackMode != null ? cfn_parse.FromCloudFormation.getString(properties.PlaybackMode) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tier", "Tier", (properties.Tier != null ? cfn_parse.FromCloudFormation.getString(properties.Tier) : undefined));
  ret.addPropertyResult("timeShiftConfiguration", "TimeShiftConfiguration", (properties.TimeShiftConfiguration != null ? CfnChannelTimeShiftConfigurationPropertyFromCloudFormation(properties.TimeShiftConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an IAM policy for the channel.
 *
 * IAM policies are used to control access to your channel.
 *
 * @cloudformationResource AWS::MediaTailor::ChannelPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channelpolicy.html
 */
export class CfnChannelPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::ChannelPolicy";

  /**
   * Build a CfnChannelPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannelPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnChannelPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnChannelPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the channel associated with this Channel Policy.
   */
  public channelName: string;

  /**
   * The IAM policy for the channel.
   */
  public policy: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelPolicyProps) {
    super(scope, id, {
      "type": CfnChannelPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "channelName", this);
    cdk.requireProperty(props, "policy", this);

    this.channelName = props.channelName;
    this.policy = props.policy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelName": this.channelName,
      "policy": this.policy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannelPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnChannelPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnChannelPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channelpolicy.html
 */
export interface CfnChannelPolicyProps {
  /**
   * The name of the channel associated with this Channel Policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channelpolicy.html#cfn-mediatailor-channelpolicy-channelname
   */
  readonly channelName: string;

  /**
   * The IAM policy for the channel.
   *
   * IAM policies are used to control access to your channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-channelpolicy.html#cfn-mediatailor-channelpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnChannelPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelName", cdk.requiredValidator)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  return errors.wrap("supplied properties not correct for \"CfnChannelPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPolicyPropsValidator(properties).assertSuccess();
  return {
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "Policy": cdk.objectToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnChannelPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelPolicyProps>();
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Live source configuration parameters.
 *
 * @cloudformationResource AWS::MediaTailor::LiveSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html
 */
export class CfnLiveSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::LiveSource";

  /**
   * Build a CfnLiveSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLiveSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLiveSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLiveSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * <p>The ARN of the live source.</p>
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The HTTP package configurations for the live source.
   */
  public httpPackageConfigurations: Array<CfnLiveSource.HttpPackageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name that's used to refer to a live source.
   */
  public liveSourceName: string;

  /**
   * The name of the source location.
   */
  public sourceLocationName: string;

  /**
   * The tags assigned to the live source.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLiveSourceProps) {
    super(scope, id, {
      "type": CfnLiveSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "httpPackageConfigurations", this);
    cdk.requireProperty(props, "liveSourceName", this);
    cdk.requireProperty(props, "sourceLocationName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.httpPackageConfigurations = props.httpPackageConfigurations;
    this.liveSourceName = props.liveSourceName;
    this.sourceLocationName = props.sourceLocationName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "httpPackageConfigurations": this.httpPackageConfigurations,
      "liveSourceName": this.liveSourceName,
      "sourceLocationName": this.sourceLocationName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLiveSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLiveSourcePropsToCloudFormation(props);
  }
}

export namespace CfnLiveSource {
  /**
   * The HTTP package configuration properties for the requested VOD source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-livesource-httppackageconfiguration.html
   */
  export interface HttpPackageConfigurationProperty {
    /**
     * The relative path to the URL for this VOD source.
     *
     * This is combined with `SourceLocation::HttpConfiguration::BaseUrl` to form a valid URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-livesource-httppackageconfiguration.html#cfn-mediatailor-livesource-httppackageconfiguration-path
     */
    readonly path: string;

    /**
     * The name of the source group.
     *
     * This has to match one of the `Channel::Outputs::SourceGroup` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-livesource-httppackageconfiguration.html#cfn-mediatailor-livesource-httppackageconfiguration-sourcegroup
     */
    readonly sourceGroup: string;

    /**
     * The streaming protocol for this package configuration.
     *
     * Supported values are `HLS` and `DASH` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-livesource-httppackageconfiguration.html#cfn-mediatailor-livesource-httppackageconfiguration-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnLiveSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html
 */
export interface CfnLiveSourceProps {
  /**
   * The HTTP package configurations for the live source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html#cfn-mediatailor-livesource-httppackageconfigurations
   */
  readonly httpPackageConfigurations: Array<CfnLiveSource.HttpPackageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name that's used to refer to a live source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html#cfn-mediatailor-livesource-livesourcename
   */
  readonly liveSourceName: string;

  /**
   * The name of the source location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html#cfn-mediatailor-livesource-sourcelocationname
   */
  readonly sourceLocationName: string;

  /**
   * The tags assigned to the live source.
   *
   * Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see [Tagging AWS Elemental MediaTailor Resources](https://docs.aws.amazon.com/mediatailor/latest/ug/tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-livesource.html#cfn-mediatailor-livesource-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `HttpPackageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPackageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLiveSourceHttpPackageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.requiredValidator)(properties.sourceGroup));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.validateString)(properties.sourceGroup));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"HttpPackageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLiveSourceHttpPackageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLiveSourceHttpPackageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path),
    "SourceGroup": cdk.stringToCloudFormation(properties.sourceGroup),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLiveSourceHttpPackageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLiveSource.HttpPackageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLiveSource.HttpPackageConfigurationProperty>();
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("sourceGroup", "SourceGroup", (properties.SourceGroup != null ? cfn_parse.FromCloudFormation.getString(properties.SourceGroup) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLiveSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnLiveSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLiveSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpPackageConfigurations", cdk.requiredValidator)(properties.httpPackageConfigurations));
  errors.collect(cdk.propertyValidator("httpPackageConfigurations", cdk.listValidator(CfnLiveSourceHttpPackageConfigurationPropertyValidator))(properties.httpPackageConfigurations));
  errors.collect(cdk.propertyValidator("liveSourceName", cdk.requiredValidator)(properties.liveSourceName));
  errors.collect(cdk.propertyValidator("liveSourceName", cdk.validateString)(properties.liveSourceName));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.requiredValidator)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.validateString)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLiveSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnLiveSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLiveSourcePropsValidator(properties).assertSuccess();
  return {
    "HttpPackageConfigurations": cdk.listMapper(convertCfnLiveSourceHttpPackageConfigurationPropertyToCloudFormation)(properties.httpPackageConfigurations),
    "LiveSourceName": cdk.stringToCloudFormation(properties.liveSourceName),
    "SourceLocationName": cdk.stringToCloudFormation(properties.sourceLocationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLiveSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLiveSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLiveSourceProps>();
  ret.addPropertyResult("httpPackageConfigurations", "HttpPackageConfigurations", (properties.HttpPackageConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnLiveSourceHttpPackageConfigurationPropertyFromCloudFormation)(properties.HttpPackageConfigurations) : undefined));
  ret.addPropertyResult("liveSourceName", "LiveSourceName", (properties.LiveSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.LiveSourceName) : undefined));
  ret.addPropertyResult("sourceLocationName", "SourceLocationName", (properties.SourceLocationName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds a new playback configuration to AWS Elemental MediaTailor .
 *
 * @cloudformationResource AWS::MediaTailor::PlaybackConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html
 */
export class CfnPlaybackConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::PlaybackConfiguration";

  /**
   * Build a CfnPlaybackConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlaybackConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPlaybackConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPlaybackConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The URL generated by MediaTailor to initiate a DASH playback session. The session uses server-side reporting.
   *
   * @cloudformationAttribute DashConfiguration.ManifestEndpointPrefix
   */
  public readonly attrDashConfigurationManifestEndpointPrefix: string;

  /**
   * The URL that is used to initiate a playback session for devices that support Apple HLS. The session uses server-side reporting.
   *
   * @cloudformationAttribute HlsConfiguration.ManifestEndpointPrefix
   */
  public readonly attrHlsConfigurationManifestEndpointPrefix: string;

  /**
   * The Amazon Resource Name (ARN) for the playback configuration.
   *
   * @cloudformationAttribute PlaybackConfigurationArn
   */
  public readonly attrPlaybackConfigurationArn: string;

  /**
   * The URL that the player accesses to get a manifest from MediaTailor . This session will use server-side reporting.
   *
   * @cloudformationAttribute PlaybackEndpointPrefix
   */
  public readonly attrPlaybackEndpointPrefix: string;

  /**
   * The URL that the player uses to initialize a session that uses client-side reporting.
   *
   * @cloudformationAttribute SessionInitializationEndpointPrefix
   */
  public readonly attrSessionInitializationEndpointPrefix: string;

  /**
   * The URL for the ad decision server (ADS).
   */
  public adDecisionServerUrl: string;

  /**
   * The configuration for avail suppression, also known as ad suppression.
   */
  public availSuppression?: CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable;

  /**
   * The configuration for bumpers.
   */
  public bumper?: CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable;

  /**
   * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
   */
  public cdnConfiguration?: CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable;

  /**
   * The player parameters and aliases used as dynamic variables during session initialization.
   */
  public configurationAliases?: cdk.IResolvable | Record<string, any | cdk.IResolvable>;

  /**
   * The configuration for a DASH source.
   */
  public dashConfiguration?: CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for HLS content.
   */
  public hlsConfiguration?: CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for pre-roll ad insertion.
   */
  public livePreRollConfiguration?: cdk.IResolvable | CfnPlaybackConfiguration.LivePreRollConfigurationProperty;

  /**
   * The configuration for manifest processing rules.
   */
  public manifestProcessingRules?: cdk.IResolvable | CfnPlaybackConfiguration.ManifestProcessingRulesProperty;

  /**
   * The identifier for the playback configuration.
   */
  public name: string;

  /**
   * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break.
   */
  public personalizationThresholdSeconds?: number;

  /**
   * The URL for a video asset to transcode and use to fill in time that's not used by ads.
   */
  public slateAdUrl?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the playback configuration.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name that is used to associate this playback configuration with a custom transcode profile.
   */
  public transcodeProfileName?: string;

  /**
   * The URL prefix for the parent manifest for the stream, minus the asset ID.
   */
  public videoContentSourceUrl: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPlaybackConfigurationProps) {
    super(scope, id, {
      "type": CfnPlaybackConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "adDecisionServerUrl", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "videoContentSourceUrl", this);

    this.attrDashConfigurationManifestEndpointPrefix = cdk.Token.asString(this.getAtt("DashConfiguration.ManifestEndpointPrefix", cdk.ResolutionTypeHint.STRING));
    this.attrHlsConfigurationManifestEndpointPrefix = cdk.Token.asString(this.getAtt("HlsConfiguration.ManifestEndpointPrefix", cdk.ResolutionTypeHint.STRING));
    this.attrPlaybackConfigurationArn = cdk.Token.asString(this.getAtt("PlaybackConfigurationArn", cdk.ResolutionTypeHint.STRING));
    this.attrPlaybackEndpointPrefix = cdk.Token.asString(this.getAtt("PlaybackEndpointPrefix", cdk.ResolutionTypeHint.STRING));
    this.attrSessionInitializationEndpointPrefix = cdk.Token.asString(this.getAtt("SessionInitializationEndpointPrefix", cdk.ResolutionTypeHint.STRING));
    this.adDecisionServerUrl = props.adDecisionServerUrl;
    this.availSuppression = props.availSuppression;
    this.bumper = props.bumper;
    this.cdnConfiguration = props.cdnConfiguration;
    this.configurationAliases = props.configurationAliases;
    this.dashConfiguration = props.dashConfiguration;
    this.hlsConfiguration = props.hlsConfiguration;
    this.livePreRollConfiguration = props.livePreRollConfiguration;
    this.manifestProcessingRules = props.manifestProcessingRules;
    this.name = props.name;
    this.personalizationThresholdSeconds = props.personalizationThresholdSeconds;
    this.slateAdUrl = props.slateAdUrl;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaTailor::PlaybackConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.transcodeProfileName = props.transcodeProfileName;
    this.videoContentSourceUrl = props.videoContentSourceUrl;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adDecisionServerUrl": this.adDecisionServerUrl,
      "availSuppression": this.availSuppression,
      "bumper": this.bumper,
      "cdnConfiguration": this.cdnConfiguration,
      "configurationAliases": this.configurationAliases,
      "dashConfiguration": this.dashConfiguration,
      "hlsConfiguration": this.hlsConfiguration,
      "livePreRollConfiguration": this.livePreRollConfiguration,
      "manifestProcessingRules": this.manifestProcessingRules,
      "name": this.name,
      "personalizationThresholdSeconds": this.personalizationThresholdSeconds,
      "slateAdUrl": this.slateAdUrl,
      "tags": this.tags.renderTags(),
      "transcodeProfileName": this.transcodeProfileName,
      "videoContentSourceUrl": this.videoContentSourceUrl
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlaybackConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPlaybackConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnPlaybackConfiguration {
  /**
   * The configuration for bumpers.
   *
   * Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see [Bumpers](https://docs.aws.amazon.com/mediatailor/latest/ug/bumpers.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html
   */
  export interface BumperProperty {
    /**
     * The URL for the end bumper asset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html#cfn-mediatailor-playbackconfiguration-bumper-endurl
     */
    readonly endUrl?: string;

    /**
     * The URL for the start bumper asset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-bumper.html#cfn-mediatailor-playbackconfiguration-bumper-starturl
     */
    readonly startUrl?: string;
  }

  /**
   * The configuration for DASH content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html
   */
  export interface DashConfigurationProperty {
    /**
     * The URL generated by MediaTailor to initiate a playback session.
     *
     * The session uses server-side reporting. This setting is ignored in PUT operations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-manifestendpointprefix
     */
    readonly manifestEndpointPrefix?: string;

    /**
     * The setting that controls whether MediaTailor includes the Location tag in DASH manifests.
     *
     * MediaTailor populates the Location tag with the URL for manifest update requests, to be used by players that don't support sticky redirects. Disable this if you have CDN routing rules set up for accessing MediaTailor manifests, and you are either using client-side reporting or your players support sticky HTTP redirects. Valid values are `DISABLED` and `EMT_DEFAULT` . The `EMT_DEFAULT` setting enables the inclusion of the tag and is the default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-mpdlocation
     */
    readonly mpdLocation?: string;

    /**
     * The setting that controls whether MediaTailor handles manifests from the origin server as multi-period manifests or single-period manifests.
     *
     * If your origin server produces single-period manifests, set this to `SINGLE_PERIOD` . The default setting is `MULTI_PERIOD` . For multi-period manifests, omit this setting or set it to `MULTI_PERIOD` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-dashconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration-originmanifesttype
     */
    readonly originManifestType?: string;
  }

  /**
   * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html
   */
  export interface CdnConfigurationProperty {
    /**
     * A non-default content delivery network (CDN) to serve ad segments.
     *
     * By default, AWS Elemental MediaTailor uses Amazon CloudFront with default cache settings as its CDN for ad segments. To set up an alternate CDN, create a rule in your CDN for the origin ads.mediatailor. *<region>* .amazonaws.com. Then specify the rule's name in this `AdSegmentUrlPrefix` . When AWS Elemental MediaTailor serves a manifest, it reports your CDN as the source for ad segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration-adsegmenturlprefix
     */
    readonly adSegmentUrlPrefix?: string;

    /**
     * A content delivery network (CDN) to cache content segments, so that content requests don’t always have to go to the origin server.
     *
     * First, create a rule in your CDN for the content segment origin server. Then specify the rule's name in this `ContentSegmentUrlPrefix` . When AWS Elemental MediaTailor serves a manifest, it reports your CDN as the source for content segments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-cdnconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration-contentsegmenturlprefix
     */
    readonly contentSegmentUrlPrefix?: string;
  }

  /**
   * The configuration for manifest processing rules.
   *
   * Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-manifestprocessingrules.html
   */
  export interface ManifestProcessingRulesProperty {
    /**
     * For HLS, when set to `true` , MediaTailor passes through `EXT-X-CUE-IN` , `EXT-X-CUE-OUT` , and `EXT-X-SPLICEPOINT-SCTE35` ad markers from the origin manifest to the MediaTailor personalized manifest.
     *
     * No logic is applied to these ad markers. For example, if `EXT-X-CUE-OUT` has a value of `60` , but no ads are filled for that ad break, MediaTailor will not set the value to `0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-manifestprocessingrules.html#cfn-mediatailor-playbackconfiguration-manifestprocessingrules-admarkerpassthrough
     */
    readonly adMarkerPassthrough?: CfnPlaybackConfiguration.AdMarkerPassthroughProperty | cdk.IResolvable;
  }

  /**
   * For HLS, when set to `true` , MediaTailor passes through `EXT-X-CUE-IN` , `EXT-X-CUE-OUT` , and `EXT-X-SPLICEPOINT-SCTE35` ad markers from the origin manifest to the MediaTailor personalized manifest.
   *
   * No logic is applied to these ad markers. For example, if `EXT-X-CUE-OUT` has a value of `60` , but no ads are filled for that ad break, MediaTailor will not set the value to `0` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-admarkerpassthrough.html
   */
  export interface AdMarkerPassthroughProperty {
    /**
     * Enables ad marker passthrough for your configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-admarkerpassthrough.html#cfn-mediatailor-playbackconfiguration-admarkerpassthrough-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * The configuration for pre-roll ad insertion.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html
   */
  export interface LivePreRollConfigurationProperty {
    /**
     * The URL for the ad decision server (ADS) for pre-roll ads.
     *
     * This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing, you can provide a static VAST URL. The maximum length is 25,000 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration-addecisionserverurl
     */
    readonly adDecisionServerUrl?: string;

    /**
     * The maximum allowed duration for the pre-roll ad avail.
     *
     * AWS Elemental MediaTailor won't play pre-roll ads to exceed this duration, regardless of the total duration of ads that the ADS returns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-liveprerollconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration-maxdurationseconds
     */
    readonly maxDurationSeconds?: number;
  }

  /**
   * The configuration for HLS content.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-hlsconfiguration.html
   */
  export interface HlsConfigurationProperty {
    /**
     * The URL that is used to initiate a playback session for devices that support Apple HLS.
     *
     * The session uses server-side reporting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-hlsconfiguration.html#cfn-mediatailor-playbackconfiguration-hlsconfiguration-manifestendpointprefix
     */
    readonly manifestEndpointPrefix?: string;
  }

  /**
   * The configuration for avail suppression, also known as ad suppression.
   *
   * For more information about ad suppression, see [Ad Suppression](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html
   */
  export interface AvailSuppressionProperty {
    /**
     * Sets the ad suppression mode.
     *
     * By default, ad suppression is off and all ad breaks are filled with ads or slate. When Mode is set to `BEHIND_LIVE_EDGE` , ad suppression is active and MediaTailor won't fill ad breaks on or behind the ad suppression Value time in the manifest lookback window. When Mode is set to `AFTER_LIVE_EDGE` , ad suppression is active and MediaTailor won't fill ad breaks that are within the live edge plus the avail suppression value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html#cfn-mediatailor-playbackconfiguration-availsuppression-mode
     */
    readonly mode?: string;

    /**
     * A live edge offset time in HH:MM:SS.
     *
     * MediaTailor won't fill ad breaks on or behind this time in the manifest lookback window. If Value is set to 00:00:00, it is in sync with the live edge, and MediaTailor won't fill any ad breaks on or behind the live edge. If you set a Value time, MediaTailor won't fill any ad breaks on or behind this time in the manifest lookback window. For example, if you set 00:45:00, then MediaTailor will fill ad breaks that occur within 45 minutes behind the live edge, but won't fill ad breaks on or behind 45 minutes behind the live edge.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-playbackconfiguration-availsuppression.html#cfn-mediatailor-playbackconfiguration-availsuppression-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnPlaybackConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html
 */
export interface CfnPlaybackConfigurationProps {
  /**
   * The URL for the ad decision server (ADS).
   *
   * This includes the specification of static parameters and placeholders for dynamic parameters. AWS Elemental MediaTailor substitutes player-specific and session-specific parameters as needed when calling the ADS. Alternately, for testing you can provide a static VAST URL. The maximum length is 25,000 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-addecisionserverurl
   */
  readonly adDecisionServerUrl: string;

  /**
   * The configuration for avail suppression, also known as ad suppression.
   *
   * For more information about ad suppression, see [Ad Suppression](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-availsuppression
   */
  readonly availSuppression?: CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable;

  /**
   * The configuration for bumpers.
   *
   * Bumpers are short audio or video clips that play at the start or before the end of an ad break. To learn more about bumpers, see [Bumpers](https://docs.aws.amazon.com/mediatailor/latest/ug/bumpers.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-bumper
   */
  readonly bumper?: CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable;

  /**
   * The configuration for using a content delivery network (CDN), like Amazon CloudFront, for content and ad segment management.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-cdnconfiguration
   */
  readonly cdnConfiguration?: CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable;

  /**
   * The player parameters and aliases used as dynamic variables during session initialization.
   *
   * For more information, see [Domain Variables](https://docs.aws.amazon.com/mediatailor/latest/ug/variables-domain.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-configurationaliases
   */
  readonly configurationAliases?: cdk.IResolvable | Record<string, any | cdk.IResolvable>;

  /**
   * The configuration for a DASH source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-dashconfiguration
   */
  readonly dashConfiguration?: CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for HLS content.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-hlsconfiguration
   */
  readonly hlsConfiguration?: CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for pre-roll ad insertion.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-liveprerollconfiguration
   */
  readonly livePreRollConfiguration?: cdk.IResolvable | CfnPlaybackConfiguration.LivePreRollConfigurationProperty;

  /**
   * The configuration for manifest processing rules.
   *
   * Manifest processing rules enable customization of the personalized manifests created by MediaTailor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-manifestprocessingrules
   */
  readonly manifestProcessingRules?: cdk.IResolvable | CfnPlaybackConfiguration.ManifestProcessingRulesProperty;

  /**
   * The identifier for the playback configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-name
   */
  readonly name: string;

  /**
   * Defines the maximum duration of underfilled ad time (in seconds) allowed in an ad break.
   *
   * If the duration of underfilled ad time exceeds the personalization threshold, then the personalization of the ad break is abandoned and the underlying content is shown. This feature applies to *ad replacement* in live and VOD streams, rather than ad insertion, because it relies on an underlying content stream. For more information about ad break behavior, including ad replacement and insertion, see [Ad Behavior in AWS Elemental MediaTailor](https://docs.aws.amazon.com/mediatailor/latest/ug/ad-behavior.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-personalizationthresholdseconds
   */
  readonly personalizationThresholdSeconds?: number;

  /**
   * The URL for a video asset to transcode and use to fill in time that's not used by ads.
   *
   * AWS Elemental MediaTailor shows the slate to fill in gaps in media content. Configuring the slate is optional for non-VPAID playback configurations. For VPAID, the slate is required because MediaTailor provides it in the slots designated for dynamic ad content. The slate must be a high-quality asset that contains both audio and video.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-slateadurl
   */
  readonly slateAdUrl?: string;

  /**
   * The tags to assign to the playback configuration.
   *
   * Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see [Tagging AWS Elemental MediaTailor Resources](https://docs.aws.amazon.com/mediatailor/latest/ug/tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name that is used to associate this playback configuration with a custom transcode profile.
   *
   * This overrides the dynamic transcoding defaults of MediaTailor. Use this only if you have already set up custom profiles with the help of AWS Support.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-transcodeprofilename
   */
  readonly transcodeProfileName?: string;

  /**
   * The URL prefix for the parent manifest for the stream, minus the asset ID.
   *
   * The maximum length is 512 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-playbackconfiguration.html#cfn-mediatailor-playbackconfiguration-videocontentsourceurl
   */
  readonly videoContentSourceUrl: string;
}

/**
 * Determine whether the given properties match those of a `BumperProperty`
 *
 * @param properties - the TypeScript properties of a `BumperProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationBumperPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endUrl", cdk.validateString)(properties.endUrl));
  errors.collect(cdk.propertyValidator("startUrl", cdk.validateString)(properties.startUrl));
  return errors.wrap("supplied properties not correct for \"BumperProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationBumperPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationBumperPropertyValidator(properties).assertSuccess();
  return {
    "EndUrl": cdk.stringToCloudFormation(properties.endUrl),
    "StartUrl": cdk.stringToCloudFormation(properties.startUrl)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationBumperPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.BumperProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.BumperProperty>();
  ret.addPropertyResult("endUrl", "EndUrl", (properties.EndUrl != null ? cfn_parse.FromCloudFormation.getString(properties.EndUrl) : undefined));
  ret.addPropertyResult("startUrl", "StartUrl", (properties.StartUrl != null ? cfn_parse.FromCloudFormation.getString(properties.StartUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DashConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationDashConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifestEndpointPrefix", cdk.validateString)(properties.manifestEndpointPrefix));
  errors.collect(cdk.propertyValidator("mpdLocation", cdk.validateString)(properties.mpdLocation));
  errors.collect(cdk.propertyValidator("originManifestType", cdk.validateString)(properties.originManifestType));
  return errors.wrap("supplied properties not correct for \"DashConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationDashConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationDashConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ManifestEndpointPrefix": cdk.stringToCloudFormation(properties.manifestEndpointPrefix),
    "MpdLocation": cdk.stringToCloudFormation(properties.mpdLocation),
    "OriginManifestType": cdk.stringToCloudFormation(properties.originManifestType)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationDashConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.DashConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.DashConfigurationProperty>();
  ret.addPropertyResult("manifestEndpointPrefix", "ManifestEndpointPrefix", (properties.ManifestEndpointPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestEndpointPrefix) : undefined));
  ret.addPropertyResult("mpdLocation", "MpdLocation", (properties.MpdLocation != null ? cfn_parse.FromCloudFormation.getString(properties.MpdLocation) : undefined));
  ret.addPropertyResult("originManifestType", "OriginManifestType", (properties.OriginManifestType != null ? cfn_parse.FromCloudFormation.getString(properties.OriginManifestType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CdnConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CdnConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationCdnConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adSegmentUrlPrefix", cdk.validateString)(properties.adSegmentUrlPrefix));
  errors.collect(cdk.propertyValidator("contentSegmentUrlPrefix", cdk.validateString)(properties.contentSegmentUrlPrefix));
  return errors.wrap("supplied properties not correct for \"CdnConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationCdnConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationCdnConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdSegmentUrlPrefix": cdk.stringToCloudFormation(properties.adSegmentUrlPrefix),
    "ContentSegmentUrlPrefix": cdk.stringToCloudFormation(properties.contentSegmentUrlPrefix)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationCdnConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.CdnConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.CdnConfigurationProperty>();
  ret.addPropertyResult("adSegmentUrlPrefix", "AdSegmentUrlPrefix", (properties.AdSegmentUrlPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.AdSegmentUrlPrefix) : undefined));
  ret.addPropertyResult("contentSegmentUrlPrefix", "ContentSegmentUrlPrefix", (properties.ContentSegmentUrlPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ContentSegmentUrlPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdMarkerPassthroughProperty`
 *
 * @param properties - the TypeScript properties of a `AdMarkerPassthroughProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationAdMarkerPassthroughPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AdMarkerPassthroughProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationAdMarkerPassthroughPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationAdMarkerPassthroughPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationAdMarkerPassthroughPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.AdMarkerPassthroughProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.AdMarkerPassthroughProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManifestProcessingRulesProperty`
 *
 * @param properties - the TypeScript properties of a `ManifestProcessingRulesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationManifestProcessingRulesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkerPassthrough", CfnPlaybackConfigurationAdMarkerPassthroughPropertyValidator)(properties.adMarkerPassthrough));
  return errors.wrap("supplied properties not correct for \"ManifestProcessingRulesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationManifestProcessingRulesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationManifestProcessingRulesPropertyValidator(properties).assertSuccess();
  return {
    "AdMarkerPassthrough": convertCfnPlaybackConfigurationAdMarkerPassthroughPropertyToCloudFormation(properties.adMarkerPassthrough)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationManifestProcessingRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPlaybackConfiguration.ManifestProcessingRulesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.ManifestProcessingRulesProperty>();
  ret.addPropertyResult("adMarkerPassthrough", "AdMarkerPassthrough", (properties.AdMarkerPassthrough != null ? CfnPlaybackConfigurationAdMarkerPassthroughPropertyFromCloudFormation(properties.AdMarkerPassthrough) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LivePreRollConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LivePreRollConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationLivePreRollConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adDecisionServerUrl", cdk.validateString)(properties.adDecisionServerUrl));
  errors.collect(cdk.propertyValidator("maxDurationSeconds", cdk.validateNumber)(properties.maxDurationSeconds));
  return errors.wrap("supplied properties not correct for \"LivePreRollConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationLivePreRollConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationLivePreRollConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdDecisionServerUrl": cdk.stringToCloudFormation(properties.adDecisionServerUrl),
    "MaxDurationSeconds": cdk.numberToCloudFormation(properties.maxDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationLivePreRollConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPlaybackConfiguration.LivePreRollConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.LivePreRollConfigurationProperty>();
  ret.addPropertyResult("adDecisionServerUrl", "AdDecisionServerUrl", (properties.AdDecisionServerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AdDecisionServerUrl) : undefined));
  ret.addPropertyResult("maxDurationSeconds", "MaxDurationSeconds", (properties.MaxDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HlsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationHlsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifestEndpointPrefix", cdk.validateString)(properties.manifestEndpointPrefix));
  return errors.wrap("supplied properties not correct for \"HlsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationHlsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationHlsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ManifestEndpointPrefix": cdk.stringToCloudFormation(properties.manifestEndpointPrefix)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationHlsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.HlsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.HlsConfigurationProperty>();
  ret.addPropertyResult("manifestEndpointPrefix", "ManifestEndpointPrefix", (properties.ManifestEndpointPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestEndpointPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AvailSuppressionProperty`
 *
 * @param properties - the TypeScript properties of a `AvailSuppressionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationAvailSuppressionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"AvailSuppressionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationAvailSuppressionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationAvailSuppressionPropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationAvailSuppressionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfiguration.AvailSuppressionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfiguration.AvailSuppressionProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPlaybackConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlaybackConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adDecisionServerUrl", cdk.requiredValidator)(properties.adDecisionServerUrl));
  errors.collect(cdk.propertyValidator("adDecisionServerUrl", cdk.validateString)(properties.adDecisionServerUrl));
  errors.collect(cdk.propertyValidator("availSuppression", CfnPlaybackConfigurationAvailSuppressionPropertyValidator)(properties.availSuppression));
  errors.collect(cdk.propertyValidator("bumper", CfnPlaybackConfigurationBumperPropertyValidator)(properties.bumper));
  errors.collect(cdk.propertyValidator("cdnConfiguration", CfnPlaybackConfigurationCdnConfigurationPropertyValidator)(properties.cdnConfiguration));
  errors.collect(cdk.propertyValidator("configurationAliases", cdk.hashValidator(cdk.validateObject))(properties.configurationAliases));
  errors.collect(cdk.propertyValidator("dashConfiguration", CfnPlaybackConfigurationDashConfigurationPropertyValidator)(properties.dashConfiguration));
  errors.collect(cdk.propertyValidator("hlsConfiguration", CfnPlaybackConfigurationHlsConfigurationPropertyValidator)(properties.hlsConfiguration));
  errors.collect(cdk.propertyValidator("livePreRollConfiguration", CfnPlaybackConfigurationLivePreRollConfigurationPropertyValidator)(properties.livePreRollConfiguration));
  errors.collect(cdk.propertyValidator("manifestProcessingRules", CfnPlaybackConfigurationManifestProcessingRulesPropertyValidator)(properties.manifestProcessingRules));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("personalizationThresholdSeconds", cdk.validateNumber)(properties.personalizationThresholdSeconds));
  errors.collect(cdk.propertyValidator("slateAdUrl", cdk.validateString)(properties.slateAdUrl));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("transcodeProfileName", cdk.validateString)(properties.transcodeProfileName));
  errors.collect(cdk.propertyValidator("videoContentSourceUrl", cdk.requiredValidator)(properties.videoContentSourceUrl));
  errors.collect(cdk.propertyValidator("videoContentSourceUrl", cdk.validateString)(properties.videoContentSourceUrl));
  return errors.wrap("supplied properties not correct for \"CfnPlaybackConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackConfigurationPropsValidator(properties).assertSuccess();
  return {
    "AdDecisionServerUrl": cdk.stringToCloudFormation(properties.adDecisionServerUrl),
    "AvailSuppression": convertCfnPlaybackConfigurationAvailSuppressionPropertyToCloudFormation(properties.availSuppression),
    "Bumper": convertCfnPlaybackConfigurationBumperPropertyToCloudFormation(properties.bumper),
    "CdnConfiguration": convertCfnPlaybackConfigurationCdnConfigurationPropertyToCloudFormation(properties.cdnConfiguration),
    "ConfigurationAliases": cdk.hashMapper(cdk.objectToCloudFormation)(properties.configurationAliases),
    "DashConfiguration": convertCfnPlaybackConfigurationDashConfigurationPropertyToCloudFormation(properties.dashConfiguration),
    "HlsConfiguration": convertCfnPlaybackConfigurationHlsConfigurationPropertyToCloudFormation(properties.hlsConfiguration),
    "LivePreRollConfiguration": convertCfnPlaybackConfigurationLivePreRollConfigurationPropertyToCloudFormation(properties.livePreRollConfiguration),
    "ManifestProcessingRules": convertCfnPlaybackConfigurationManifestProcessingRulesPropertyToCloudFormation(properties.manifestProcessingRules),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PersonalizationThresholdSeconds": cdk.numberToCloudFormation(properties.personalizationThresholdSeconds),
    "SlateAdUrl": cdk.stringToCloudFormation(properties.slateAdUrl),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TranscodeProfileName": cdk.stringToCloudFormation(properties.transcodeProfileName),
    "VideoContentSourceUrl": cdk.stringToCloudFormation(properties.videoContentSourceUrl)
  };
}

// @ts-ignore TS6133
function CfnPlaybackConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackConfigurationProps>();
  ret.addPropertyResult("adDecisionServerUrl", "AdDecisionServerUrl", (properties.AdDecisionServerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AdDecisionServerUrl) : undefined));
  ret.addPropertyResult("availSuppression", "AvailSuppression", (properties.AvailSuppression != null ? CfnPlaybackConfigurationAvailSuppressionPropertyFromCloudFormation(properties.AvailSuppression) : undefined));
  ret.addPropertyResult("bumper", "Bumper", (properties.Bumper != null ? CfnPlaybackConfigurationBumperPropertyFromCloudFormation(properties.Bumper) : undefined));
  ret.addPropertyResult("cdnConfiguration", "CdnConfiguration", (properties.CdnConfiguration != null ? CfnPlaybackConfigurationCdnConfigurationPropertyFromCloudFormation(properties.CdnConfiguration) : undefined));
  ret.addPropertyResult("configurationAliases", "ConfigurationAliases", (properties.ConfigurationAliases != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getAny)(properties.ConfigurationAliases) : undefined));
  ret.addPropertyResult("dashConfiguration", "DashConfiguration", (properties.DashConfiguration != null ? CfnPlaybackConfigurationDashConfigurationPropertyFromCloudFormation(properties.DashConfiguration) : undefined));
  ret.addPropertyResult("hlsConfiguration", "HlsConfiguration", (properties.HlsConfiguration != null ? CfnPlaybackConfigurationHlsConfigurationPropertyFromCloudFormation(properties.HlsConfiguration) : undefined));
  ret.addPropertyResult("livePreRollConfiguration", "LivePreRollConfiguration", (properties.LivePreRollConfiguration != null ? CfnPlaybackConfigurationLivePreRollConfigurationPropertyFromCloudFormation(properties.LivePreRollConfiguration) : undefined));
  ret.addPropertyResult("manifestProcessingRules", "ManifestProcessingRules", (properties.ManifestProcessingRules != null ? CfnPlaybackConfigurationManifestProcessingRulesPropertyFromCloudFormation(properties.ManifestProcessingRules) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("personalizationThresholdSeconds", "PersonalizationThresholdSeconds", (properties.PersonalizationThresholdSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PersonalizationThresholdSeconds) : undefined));
  ret.addPropertyResult("slateAdUrl", "SlateAdUrl", (properties.SlateAdUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SlateAdUrl) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("transcodeProfileName", "TranscodeProfileName", (properties.TranscodeProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.TranscodeProfileName) : undefined));
  ret.addPropertyResult("videoContentSourceUrl", "VideoContentSourceUrl", (properties.VideoContentSourceUrl != null ? cfn_parse.FromCloudFormation.getString(properties.VideoContentSourceUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A source location is a container for sources.
 *
 * For more information about source locations, see [Working with source locations](https://docs.aws.amazon.com/mediatailor/latest/ug/channel-assembly-source-locations.html) in the *MediaTailor User Guide* .
 *
 * @cloudformationResource AWS::MediaTailor::SourceLocation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html
 */
export class CfnSourceLocation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::SourceLocation";

  /**
   * Build a CfnSourceLocation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSourceLocation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSourceLocationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSourceLocation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * <p>The ARN of the source location.</p>
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The access configuration for the source location.
   */
  public accessConfiguration?: CfnSourceLocation.AccessConfigurationProperty | cdk.IResolvable;

  /**
   * The default segment delivery configuration.
   */
  public defaultSegmentDeliveryConfiguration?: CfnSourceLocation.DefaultSegmentDeliveryConfigurationProperty | cdk.IResolvable;

  /**
   * The HTTP configuration for the source location.
   */
  public httpConfiguration: CfnSourceLocation.HttpConfigurationProperty | cdk.IResolvable;

  /**
   * The segment delivery configurations for the source location.
   */
  public segmentDeliveryConfigurations?: Array<cdk.IResolvable | CfnSourceLocation.SegmentDeliveryConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the source location.
   */
  public sourceLocationName: string;

  /**
   * The tags assigned to the source location.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSourceLocationProps) {
    super(scope, id, {
      "type": CfnSourceLocation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "httpConfiguration", this);
    cdk.requireProperty(props, "sourceLocationName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.accessConfiguration = props.accessConfiguration;
    this.defaultSegmentDeliveryConfiguration = props.defaultSegmentDeliveryConfiguration;
    this.httpConfiguration = props.httpConfiguration;
    this.segmentDeliveryConfigurations = props.segmentDeliveryConfigurations;
    this.sourceLocationName = props.sourceLocationName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessConfiguration": this.accessConfiguration,
      "defaultSegmentDeliveryConfiguration": this.defaultSegmentDeliveryConfiguration,
      "httpConfiguration": this.httpConfiguration,
      "segmentDeliveryConfigurations": this.segmentDeliveryConfigurations,
      "sourceLocationName": this.sourceLocationName,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSourceLocation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSourceLocationPropsToCloudFormation(props);
  }
}

export namespace CfnSourceLocation {
  /**
   * The optional configuration for a server that serves segments.
   *
   * Use this if you want the segment delivery server to be different from the source location server. For example, you can configure your source location server to be an origination server, such as MediaPackage, and the segment delivery server to be a content delivery network (CDN), such as CloudFront. If you don't specify a segment delivery server, then the source location server is used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-defaultsegmentdeliveryconfiguration.html
   */
  export interface DefaultSegmentDeliveryConfigurationProperty {
    /**
     * The hostname of the server that will be used to serve segments.
     *
     * This string must include the protocol, such as *https://* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-defaultsegmentdeliveryconfiguration.html#cfn-mediatailor-sourcelocation-defaultsegmentdeliveryconfiguration-baseurl
     */
    readonly baseUrl?: string;
  }

  /**
   * The segment delivery configuration settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-segmentdeliveryconfiguration.html
   */
  export interface SegmentDeliveryConfigurationProperty {
    /**
     * The base URL of the host or path of the segment delivery server that you're using to serve segments.
     *
     * This is typically a content delivery network (CDN). The URL can be absolute or relative. To use an absolute URL include the protocol, such as `https://example.com/some/path` . To use a relative URL specify the relative path, such as `/some/path*` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-segmentdeliveryconfiguration.html#cfn-mediatailor-sourcelocation-segmentdeliveryconfiguration-baseurl
     */
    readonly baseUrl?: string;

    /**
     * A unique identifier used to distinguish between multiple segment delivery configurations in a source location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-segmentdeliveryconfiguration.html#cfn-mediatailor-sourcelocation-segmentdeliveryconfiguration-name
     */
    readonly name?: string;
  }

  /**
   * The HTTP configuration for the source location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-httpconfiguration.html
   */
  export interface HttpConfigurationProperty {
    /**
     * The base URL for the source location host server.
     *
     * This string must include the protocol, such as *https://* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-httpconfiguration.html#cfn-mediatailor-sourcelocation-httpconfiguration-baseurl
     */
    readonly baseUrl: string;
  }

  /**
   * Access configuration parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-accessconfiguration.html
   */
  export interface AccessConfigurationProperty {
    /**
     * The type of authentication used to access content from `HttpConfiguration::BaseUrl` on your source location. Accepted value: `S3_SIGV4` .
     *
     * `S3_SIGV4` - AWS Signature Version 4 authentication for Amazon S3 hosted virtual-style access. If your source location base URL is an Amazon S3 bucket, MediaTailor can use AWS Signature Version 4 (SigV4) authentication to access the bucket where your source content is stored. Your MediaTailor source location baseURL must follow the S3 virtual hosted-style request URL format. For example, https://bucket-name.s3.Region.amazonaws.com/key-name.
     *
     * Before you can use `S3_SIGV4` , you must meet these requirements:
     *
     * • You must allow MediaTailor to access your S3 bucket by granting mediatailor.amazonaws.com principal access in IAM. For information about configuring access in IAM, see Access management in the IAM User Guide.
     *
     * • The mediatailor.amazonaws.com service principal must have permissions to read all top level manifests referenced by the VodSource packaging configurations.
     *
     * • The caller of the API must have s3:GetObject IAM permissions to read all top level manifests referenced by your MediaTailor VodSource packaging configurations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-accessconfiguration.html#cfn-mediatailor-sourcelocation-accessconfiguration-accesstype
     */
    readonly accessType?: string;

    /**
     * AWS Secrets Manager access token configuration parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-accessconfiguration.html#cfn-mediatailor-sourcelocation-accessconfiguration-secretsmanageraccesstokenconfiguration
     */
    readonly secretsManagerAccessTokenConfiguration?: cdk.IResolvable | CfnSourceLocation.SecretsManagerAccessTokenConfigurationProperty;
  }

  /**
   * AWS Secrets Manager access token configuration parameters.
   *
   * For information about Secrets Manager access token authentication, see [Working with AWS Secrets Manager access token authentication](https://docs.aws.amazon.com/mediatailor/latest/ug/channel-assembly-access-configuration-access-token.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration.html
   */
  export interface SecretsManagerAccessTokenConfigurationProperty {
    /**
     * The name of the HTTP header used to supply the access token in requests to the source location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration.html#cfn-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration-headername
     */
    readonly headerName?: string;

    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager secret that contains the access token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration.html#cfn-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration-secretarn
     */
    readonly secretArn?: string;

    /**
     * The AWS Secrets Manager [SecretString](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_CreateSecret.html#SecretsManager-CreateSecret-request-SecretString.html) key associated with the access token. MediaTailor uses the key to look up SecretString key and value pair containing the access token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration.html#cfn-mediatailor-sourcelocation-secretsmanageraccesstokenconfiguration-secretstringkey
     */
    readonly secretStringKey?: string;
  }
}

/**
 * Properties for defining a `CfnSourceLocation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html
 */
export interface CfnSourceLocationProps {
  /**
   * The access configuration for the source location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-accessconfiguration
   */
  readonly accessConfiguration?: CfnSourceLocation.AccessConfigurationProperty | cdk.IResolvable;

  /**
   * The default segment delivery configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-defaultsegmentdeliveryconfiguration
   */
  readonly defaultSegmentDeliveryConfiguration?: CfnSourceLocation.DefaultSegmentDeliveryConfigurationProperty | cdk.IResolvable;

  /**
   * The HTTP configuration for the source location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-httpconfiguration
   */
  readonly httpConfiguration: CfnSourceLocation.HttpConfigurationProperty | cdk.IResolvable;

  /**
   * The segment delivery configurations for the source location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-segmentdeliveryconfigurations
   */
  readonly segmentDeliveryConfigurations?: Array<cdk.IResolvable | CfnSourceLocation.SegmentDeliveryConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the source location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-sourcelocationname
   */
  readonly sourceLocationName: string;

  /**
   * The tags assigned to the source location.
   *
   * Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see [Tagging AWS Elemental MediaTailor Resources](https://docs.aws.amazon.com/mediatailor/latest/ug/tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-sourcelocation.html#cfn-mediatailor-sourcelocation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DefaultSegmentDeliveryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultSegmentDeliveryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseUrl", cdk.validateString)(properties.baseUrl));
  return errors.wrap("supplied properties not correct for \"DefaultSegmentDeliveryConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BaseUrl": cdk.stringToCloudFormation(properties.baseUrl)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSourceLocation.DefaultSegmentDeliveryConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocation.DefaultSegmentDeliveryConfigurationProperty>();
  ret.addPropertyResult("baseUrl", "BaseUrl", (properties.BaseUrl != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SegmentDeliveryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentDeliveryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationSegmentDeliveryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseUrl", cdk.validateString)(properties.baseUrl));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SegmentDeliveryConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationSegmentDeliveryConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationSegmentDeliveryConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BaseUrl": cdk.stringToCloudFormation(properties.baseUrl),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationSegmentDeliveryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSourceLocation.SegmentDeliveryConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocation.SegmentDeliveryConfigurationProperty>();
  ret.addPropertyResult("baseUrl", "BaseUrl", (properties.BaseUrl != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrl) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationHttpConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseUrl", cdk.requiredValidator)(properties.baseUrl));
  errors.collect(cdk.propertyValidator("baseUrl", cdk.validateString)(properties.baseUrl));
  return errors.wrap("supplied properties not correct for \"HttpConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationHttpConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationHttpConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BaseUrl": cdk.stringToCloudFormation(properties.baseUrl)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationHttpConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSourceLocation.HttpConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocation.HttpConfigurationProperty>();
  ret.addPropertyResult("baseUrl", "BaseUrl", (properties.BaseUrl != null ? cfn_parse.FromCloudFormation.getString(properties.BaseUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecretsManagerAccessTokenConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SecretsManagerAccessTokenConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretStringKey", cdk.validateString)(properties.secretStringKey));
  return errors.wrap("supplied properties not correct for \"SecretsManagerAccessTokenConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "HeaderName": cdk.stringToCloudFormation(properties.headerName),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "SecretStringKey": cdk.stringToCloudFormation(properties.secretStringKey)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSourceLocation.SecretsManagerAccessTokenConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocation.SecretsManagerAccessTokenConfigurationProperty>();
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("secretStringKey", "SecretStringKey", (properties.SecretStringKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretStringKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AccessConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationAccessConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessType", cdk.validateString)(properties.accessType));
  errors.collect(cdk.propertyValidator("secretsManagerAccessTokenConfiguration", CfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyValidator)(properties.secretsManagerAccessTokenConfiguration));
  return errors.wrap("supplied properties not correct for \"AccessConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationAccessConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationAccessConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessType": cdk.stringToCloudFormation(properties.accessType),
    "SecretsManagerAccessTokenConfiguration": convertCfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyToCloudFormation(properties.secretsManagerAccessTokenConfiguration)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationAccessConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSourceLocation.AccessConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocation.AccessConfigurationProperty>();
  ret.addPropertyResult("accessType", "AccessType", (properties.AccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessType) : undefined));
  ret.addPropertyResult("secretsManagerAccessTokenConfiguration", "SecretsManagerAccessTokenConfiguration", (properties.SecretsManagerAccessTokenConfiguration != null ? CfnSourceLocationSecretsManagerAccessTokenConfigurationPropertyFromCloudFormation(properties.SecretsManagerAccessTokenConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSourceLocationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSourceLocationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSourceLocationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessConfiguration", CfnSourceLocationAccessConfigurationPropertyValidator)(properties.accessConfiguration));
  errors.collect(cdk.propertyValidator("defaultSegmentDeliveryConfiguration", CfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyValidator)(properties.defaultSegmentDeliveryConfiguration));
  errors.collect(cdk.propertyValidator("httpConfiguration", cdk.requiredValidator)(properties.httpConfiguration));
  errors.collect(cdk.propertyValidator("httpConfiguration", CfnSourceLocationHttpConfigurationPropertyValidator)(properties.httpConfiguration));
  errors.collect(cdk.propertyValidator("segmentDeliveryConfigurations", cdk.listValidator(CfnSourceLocationSegmentDeliveryConfigurationPropertyValidator))(properties.segmentDeliveryConfigurations));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.requiredValidator)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.validateString)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSourceLocationProps\"");
}

// @ts-ignore TS6133
function convertCfnSourceLocationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSourceLocationPropsValidator(properties).assertSuccess();
  return {
    "AccessConfiguration": convertCfnSourceLocationAccessConfigurationPropertyToCloudFormation(properties.accessConfiguration),
    "DefaultSegmentDeliveryConfiguration": convertCfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyToCloudFormation(properties.defaultSegmentDeliveryConfiguration),
    "HttpConfiguration": convertCfnSourceLocationHttpConfigurationPropertyToCloudFormation(properties.httpConfiguration),
    "SegmentDeliveryConfigurations": cdk.listMapper(convertCfnSourceLocationSegmentDeliveryConfigurationPropertyToCloudFormation)(properties.segmentDeliveryConfigurations),
    "SourceLocationName": cdk.stringToCloudFormation(properties.sourceLocationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSourceLocationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSourceLocationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSourceLocationProps>();
  ret.addPropertyResult("accessConfiguration", "AccessConfiguration", (properties.AccessConfiguration != null ? CfnSourceLocationAccessConfigurationPropertyFromCloudFormation(properties.AccessConfiguration) : undefined));
  ret.addPropertyResult("defaultSegmentDeliveryConfiguration", "DefaultSegmentDeliveryConfiguration", (properties.DefaultSegmentDeliveryConfiguration != null ? CfnSourceLocationDefaultSegmentDeliveryConfigurationPropertyFromCloudFormation(properties.DefaultSegmentDeliveryConfiguration) : undefined));
  ret.addPropertyResult("httpConfiguration", "HttpConfiguration", (properties.HttpConfiguration != null ? CfnSourceLocationHttpConfigurationPropertyFromCloudFormation(properties.HttpConfiguration) : undefined));
  ret.addPropertyResult("segmentDeliveryConfigurations", "SegmentDeliveryConfigurations", (properties.SegmentDeliveryConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnSourceLocationSegmentDeliveryConfigurationPropertyFromCloudFormation)(properties.SegmentDeliveryConfigurations) : undefined));
  ret.addPropertyResult("sourceLocationName", "SourceLocationName", (properties.SourceLocationName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The VOD source configuration parameters.
 *
 * @cloudformationResource AWS::MediaTailor::VodSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html
 */
export class CfnVodSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaTailor::VodSource";

  /**
   * Build a CfnVodSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVodSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVodSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVodSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * <p>The ARN of the VOD source.</p>
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The HTTP package configurations for the VOD source.
   */
  public httpPackageConfigurations: Array<CfnVodSource.HttpPackageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the source location that the VOD source is associated with.
   */
  public sourceLocationName: string;

  /**
   * The tags assigned to the VOD source.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The name of the VOD source.
   */
  public vodSourceName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVodSourceProps) {
    super(scope, id, {
      "type": CfnVodSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "httpPackageConfigurations", this);
    cdk.requireProperty(props, "sourceLocationName", this);
    cdk.requireProperty(props, "vodSourceName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.httpPackageConfigurations = props.httpPackageConfigurations;
    this.sourceLocationName = props.sourceLocationName;
    this.tags = props.tags;
    this.vodSourceName = props.vodSourceName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "httpPackageConfigurations": this.httpPackageConfigurations,
      "sourceLocationName": this.sourceLocationName,
      "tags": this.tags,
      "vodSourceName": this.vodSourceName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVodSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVodSourcePropsToCloudFormation(props);
  }
}

export namespace CfnVodSource {
  /**
   * The HTTP package configuration properties for the requested VOD source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-vodsource-httppackageconfiguration.html
   */
  export interface HttpPackageConfigurationProperty {
    /**
     * The relative path to the URL for this VOD source.
     *
     * This is combined with `SourceLocation::HttpConfiguration::BaseUrl` to form a valid URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-vodsource-httppackageconfiguration.html#cfn-mediatailor-vodsource-httppackageconfiguration-path
     */
    readonly path: string;

    /**
     * The name of the source group.
     *
     * This has to match one of the `Channel::Outputs::SourceGroup` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-vodsource-httppackageconfiguration.html#cfn-mediatailor-vodsource-httppackageconfiguration-sourcegroup
     */
    readonly sourceGroup: string;

    /**
     * The streaming protocol for this package configuration.
     *
     * Supported values are `HLS` and `DASH` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediatailor-vodsource-httppackageconfiguration.html#cfn-mediatailor-vodsource-httppackageconfiguration-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnVodSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html
 */
export interface CfnVodSourceProps {
  /**
   * The HTTP package configurations for the VOD source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html#cfn-mediatailor-vodsource-httppackageconfigurations
   */
  readonly httpPackageConfigurations: Array<CfnVodSource.HttpPackageConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the source location that the VOD source is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html#cfn-mediatailor-vodsource-sourcelocationname
   */
  readonly sourceLocationName: string;

  /**
   * The tags assigned to the VOD source.
   *
   * Tags are key-value pairs that you can associate with Amazon resources to help with organization, access control, and cost tracking. For more information, see [Tagging AWS Elemental MediaTailor Resources](https://docs.aws.amazon.com/mediatailor/latest/ug/tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html#cfn-mediatailor-vodsource-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the VOD source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediatailor-vodsource.html#cfn-mediatailor-vodsource-vodsourcename
   */
  readonly vodSourceName: string;
}

/**
 * Determine whether the given properties match those of a `HttpPackageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpPackageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVodSourceHttpPackageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.requiredValidator)(properties.sourceGroup));
  errors.collect(cdk.propertyValidator("sourceGroup", cdk.validateString)(properties.sourceGroup));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"HttpPackageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnVodSourceHttpPackageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVodSourceHttpPackageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path),
    "SourceGroup": cdk.stringToCloudFormation(properties.sourceGroup),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnVodSourceHttpPackageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVodSource.HttpPackageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVodSource.HttpPackageConfigurationProperty>();
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("sourceGroup", "SourceGroup", (properties.SourceGroup != null ? cfn_parse.FromCloudFormation.getString(properties.SourceGroup) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVodSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnVodSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVodSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpPackageConfigurations", cdk.requiredValidator)(properties.httpPackageConfigurations));
  errors.collect(cdk.propertyValidator("httpPackageConfigurations", cdk.listValidator(CfnVodSourceHttpPackageConfigurationPropertyValidator))(properties.httpPackageConfigurations));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.requiredValidator)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("sourceLocationName", cdk.validateString)(properties.sourceLocationName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vodSourceName", cdk.requiredValidator)(properties.vodSourceName));
  errors.collect(cdk.propertyValidator("vodSourceName", cdk.validateString)(properties.vodSourceName));
  return errors.wrap("supplied properties not correct for \"CfnVodSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnVodSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVodSourcePropsValidator(properties).assertSuccess();
  return {
    "HttpPackageConfigurations": cdk.listMapper(convertCfnVodSourceHttpPackageConfigurationPropertyToCloudFormation)(properties.httpPackageConfigurations),
    "SourceLocationName": cdk.stringToCloudFormation(properties.sourceLocationName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VodSourceName": cdk.stringToCloudFormation(properties.vodSourceName)
  };
}

// @ts-ignore TS6133
function CfnVodSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVodSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVodSourceProps>();
  ret.addPropertyResult("httpPackageConfigurations", "HttpPackageConfigurations", (properties.HttpPackageConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnVodSourceHttpPackageConfigurationPropertyFromCloudFormation)(properties.HttpPackageConfigurations) : undefined));
  ret.addPropertyResult("sourceLocationName", "SourceLocationName", (properties.SourceLocationName != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vodSourceName", "VodSourceName", (properties.VodSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.VodSourceName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}