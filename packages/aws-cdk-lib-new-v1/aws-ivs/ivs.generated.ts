/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::IVS::Channel` resource specifies an  channel.
 *
 * A channel stores configuration information related to your live stream. For more information, see [CreateChannel](https://docs.aws.amazon.com/ivs/latest/APIReference/API_CreateChannel.html) in the *Amazon Interactive Video Service API Reference* .
 *
 * > By default, the IVS API CreateChannel endpoint creates a stream key in addition to a channel. The  Channel resource *does not* create a stream key; to create a stream key, use the StreamKey resource instead.
 *
 * @cloudformationResource AWS::IVS::Channel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVS::Channel";

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
   * The channel ARN. For example: `arn:aws:ivs:us-west-2:123456789012:channel/abcdABCDefgh`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Channel ingest endpoint, part of the definition of an ingest server, used when you set up streaming software.
   *
   * For example: `a1b2c3d4e5f6.global-contribute.live-video.net`
   *
   * @cloudformationAttribute IngestEndpoint
   */
  public readonly attrIngestEndpoint: string;

  /**
   * Channel playback URL. For example: `https://a1b2c3d4e5f6.us-west-2.playback.live-video.net/api/video/v1/us-west-2.123456789012.channel.abcdEFGH.m3u8`
   *
   * @cloudformationAttribute PlaybackUrl
   */
  public readonly attrPlaybackUrl: string;

  /**
   * Whether the channel is authorized.
   */
  public authorized?: boolean | cdk.IResolvable;

  /**
   * Whether the channel allows insecure RTMP ingest.
   */
  public insecureIngest?: boolean | cdk.IResolvable;

  /**
   * Channel latency mode. Valid values:.
   */
  public latencyMode?: string;

  /**
   * Channel name.
   */
  public name?: string;

  /**
   * An optional transcode preset for the channel.
   */
  public preset?: string;

  /**
   * The ARN of a RecordingConfiguration resource.
   */
  public recordingConfigurationArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The channel type, which determines the allowable resolution and bitrate.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelProps = {}) {
    super(scope, id, {
      "type": CfnChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrIngestEndpoint = cdk.Token.asString(this.getAtt("IngestEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrPlaybackUrl = cdk.Token.asString(this.getAtt("PlaybackUrl", cdk.ResolutionTypeHint.STRING));
    this.authorized = props.authorized;
    this.insecureIngest = props.insecureIngest;
    this.latencyMode = props.latencyMode;
    this.name = props.name;
    this.preset = props.preset;
    this.recordingConfigurationArn = props.recordingConfigurationArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVS::Channel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorized": this.authorized,
      "insecureIngest": this.insecureIngest,
      "latencyMode": this.latencyMode,
      "name": this.name,
      "preset": this.preset,
      "recordingConfigurationArn": this.recordingConfigurationArn,
      "tags": this.tags.renderTags(),
      "type": this.type
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

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html
 */
export interface CfnChannelProps {
  /**
   * Whether the channel is authorized.
   *
   * *Default* : `false`
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-authorized
   */
  readonly authorized?: boolean | cdk.IResolvable;

  /**
   * Whether the channel allows insecure RTMP ingest.
   *
   * *Default* : `false`
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-insecureingest
   */
  readonly insecureIngest?: boolean | cdk.IResolvable;

  /**
   * Channel latency mode. Valid values:.
   *
   * - `NORMAL` : Use NORMAL to broadcast and deliver live video up to Full HD.
   * - `LOW` : Use LOW for near real-time interactions with viewers.
   *
   * > In the  console, `LOW` and `NORMAL` correspond to `Ultra-low` and `Standard` , respectively.
   *
   * *Default* : `LOW`
   *
   * @default - "LOW"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-latencymode
   */
  readonly latencyMode?: string;

  /**
   * Channel name.
   *
   * @default - "-"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-name
   */
  readonly name?: string;

  /**
   * An optional transcode preset for the channel.
   *
   * This is selectable only for `ADVANCED_HD` and `ADVANCED_SD` channel types. For those channel types, the default preset is `HIGHER_BANDWIDTH_DELIVERY` . For other channel types ( `BASIC` and `STANDARD` ), `preset` is the empty string ("").
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-preset
   */
  readonly preset?: string;

  /**
   * The ARN of a RecordingConfiguration resource.
   *
   * An empty string indicates that recording is disabled for the channel. A RecordingConfiguration ARN indicates that recording is enabled using the specified recording configuration. See the [RecordingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html) resource for more information and an example.
   *
   * *Default* : "" (empty string, recording is disabled)
   *
   * @default - ""
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-recordingconfigurationarn
   */
  readonly recordingConfigurationArn?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-channel-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The channel type, which determines the allowable resolution and bitrate.
   *
   * *If you exceed the allowable resolution or bitrate, the stream probably will disconnect immediately.* Valid values:
   *
   * - `STANDARD` : Video is transcoded: multiple qualities are generated from the original input to automatically give viewers the best experience for their devices and network conditions. Transcoding allows higher playback quality across a range of download speeds. Resolution can be up to 1080p and bitrate can be up to 8.5 Mbps. Audio is transcoded only for renditions 360p and below; above that, audio is passed through.
   * - `BASIC` : Video is transmuxed: Amazon IVS delivers the original input to viewers. The viewer’s video-quality choice is limited to the original input. Resolution can be up to 1080p and bitrate can be up to 1.5 Mbps for 480p and up to 3.5 Mbps for resolutions between 480p and 1080p.
   * - `ADVANCED_SD` : Video is transcoded; multiple qualities are generated from the original input, to automatically give viewers the best experience for their devices and network conditions. Input resolution can be up to 1080p and bitrate can be up to 8.5 Mbps; output is capped at SD quality (480p). You can select an optional transcode preset (see below). Audio for all renditions is transcoded, and an audio-only rendition is available.
   * - `ADVANCED_HD` : Video is transcoded; multiple qualities are generated from the original input, to automatically give viewers the best experience for their devices and network conditions. Input resolution can be up to 1080p and bitrate can be up to 8.5 Mbps; output is capped at HD quality (720p). You can select an optional transcode preset (see below). Audio for all renditions is transcoded, and an audio-only rendition is available.
   *
   * Optional *transcode presets* (available for the `ADVANCED` types) allow you to trade off available download bandwidth and video quality, to optimize the viewing experience. There are two presets:
   *
   * - *Constrained bandwidth delivery* uses a lower bitrate for each quality level. Use it if you have low download bandwidth and/or simple video content (e.g., talking heads)
   * - *Higher bandwidth delivery* uses a higher bitrate for each quality level. Use it if you have high download bandwidth and/or complex video content (e.g., flashes and quick scene changes).
   *
   * *Default* : `STANDARD`
   *
   * @default - "STANDARD"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-channel.html#cfn-ivs-channel-type
   */
  readonly type?: string;
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
  errors.collect(cdk.propertyValidator("authorized", cdk.validateBoolean)(properties.authorized));
  errors.collect(cdk.propertyValidator("insecureIngest", cdk.validateBoolean)(properties.insecureIngest));
  errors.collect(cdk.propertyValidator("latencyMode", cdk.validateString)(properties.latencyMode));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("preset", cdk.validateString)(properties.preset));
  errors.collect(cdk.propertyValidator("recordingConfigurationArn", cdk.validateString)(properties.recordingConfigurationArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPropsValidator(properties).assertSuccess();
  return {
    "Authorized": cdk.booleanToCloudFormation(properties.authorized),
    "InsecureIngest": cdk.booleanToCloudFormation(properties.insecureIngest),
    "LatencyMode": cdk.stringToCloudFormation(properties.latencyMode),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Preset": cdk.stringToCloudFormation(properties.preset),
    "RecordingConfigurationArn": cdk.stringToCloudFormation(properties.recordingConfigurationArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
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
  ret.addPropertyResult("authorized", "Authorized", (properties.Authorized != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Authorized) : undefined));
  ret.addPropertyResult("insecureIngest", "InsecureIngest", (properties.InsecureIngest != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InsecureIngest) : undefined));
  ret.addPropertyResult("latencyMode", "LatencyMode", (properties.LatencyMode != null ? cfn_parse.FromCloudFormation.getString(properties.LatencyMode) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("preset", "Preset", (properties.Preset != null ? cfn_parse.FromCloudFormation.getString(properties.Preset) : undefined));
  ret.addPropertyResult("recordingConfigurationArn", "RecordingConfigurationArn", (properties.RecordingConfigurationArn != null ? cfn_parse.FromCloudFormation.getString(properties.RecordingConfigurationArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IVS::PlaybackKeyPair` resource specifies an  playback key pair.
 *
 * uses a public playback key to validate playback tokens that have been signed with the corresponding private key. For more information, see [Setting Up Private Channels](https://docs.aws.amazon.com/ivs/latest/userguide/private-channels.html) in the *Amazon Interactive Video Service User Guide* .
 *
 * @cloudformationResource AWS::IVS::PlaybackKeyPair
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-playbackkeypair.html
 */
export class CfnPlaybackKeyPair extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVS::PlaybackKeyPair";

  /**
   * Build a CfnPlaybackKeyPair from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPlaybackKeyPair {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPlaybackKeyPairPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPlaybackKeyPair(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Key-pair ARN. For example: `arn:aws:ivs:us-west-2:693991300569:playback-key/f99cde61-c2b0-4df3-8941-ca7d38acca1a`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Key-pair identifier. For example: `98:0d:1a:a0:19:96:1e:ea:0a:0a:2c:9a:42:19:2b:e7`
   *
   * @cloudformationAttribute Fingerprint
   */
  public readonly attrFingerprint: string;

  /**
   * Playback-key-pair name.
   */
  public name?: string;

  /**
   * The public portion of a customer-generated key pair.
   */
  public publicKeyMaterial?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPlaybackKeyPairProps = {}) {
    super(scope, id, {
      "type": CfnPlaybackKeyPair.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrFingerprint = cdk.Token.asString(this.getAtt("Fingerprint", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.publicKeyMaterial = props.publicKeyMaterial;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVS::PlaybackKeyPair", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "publicKeyMaterial": this.publicKeyMaterial,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPlaybackKeyPair.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPlaybackKeyPairPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPlaybackKeyPair`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-playbackkeypair.html
 */
export interface CfnPlaybackKeyPairProps {
  /**
   * Playback-key-pair name.
   *
   * The value does not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-playbackkeypair.html#cfn-ivs-playbackkeypair-name
   */
  readonly name?: string;

  /**
   * The public portion of a customer-generated key pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-playbackkeypair.html#cfn-ivs-playbackkeypair-publickeymaterial
   */
  readonly publicKeyMaterial?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-playbackkeypair-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-playbackkeypair.html#cfn-ivs-playbackkeypair-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPlaybackKeyPairProps`
 *
 * @param properties - the TypeScript properties of a `CfnPlaybackKeyPairProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPlaybackKeyPairPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("publicKeyMaterial", cdk.validateString)(properties.publicKeyMaterial));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPlaybackKeyPairProps\"");
}

// @ts-ignore TS6133
function convertCfnPlaybackKeyPairPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPlaybackKeyPairPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PublicKeyMaterial": cdk.stringToCloudFormation(properties.publicKeyMaterial),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPlaybackKeyPairPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPlaybackKeyPairProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPlaybackKeyPairProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("publicKeyMaterial", "PublicKeyMaterial", (properties.PublicKeyMaterial != null ? cfn_parse.FromCloudFormation.getString(properties.PublicKeyMaterial) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IVS::RecordingConfiguration` resource specifies an  recording configuration.
 *
 * A recording configuration enables the recording of a channel’s live streams to a data store. Multiple channels can reference the same recording configuration. For more information, see [RecordingConfiguration](https://docs.aws.amazon.com/ivs/latest/APIReference/API_RecordingConfiguration.html) in the *Amazon Interactive Video Service API Reference* .
 *
 * @cloudformationResource AWS::IVS::RecordingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html
 */
export class CfnRecordingConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVS::RecordingConfiguration";

  /**
   * Build a CfnRecordingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRecordingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRecordingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRecordingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The recording configuration ARN. For example: `arn:aws:ivs:us-west-2:123456789012:recording-configuration/abcdABCDefgh`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Indicates the current state of the recording configuration. When the state is `ACTIVE` , the configuration is ready to record a channel stream. Valid values: `CREATING` | `CREATE_FAILED` | `ACTIVE` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * A destination configuration contains information about where recorded video will be stored.
   */
  public destinationConfiguration: CfnRecordingConfiguration.DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Recording-configuration name.
   */
  public name?: string;

  /**
   * If a broadcast disconnects and then reconnects within the specified interval, the multiple streams will be considered a single broadcast and merged together.
   */
  public recordingReconnectWindowSeconds?: number;

  /**
   * A rendition configuration describes which renditions should be recorded for a stream.
   */
  public renditionConfiguration?: cdk.IResolvable | CfnRecordingConfiguration.RenditionConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A thumbnail configuration enables/disables the recording of thumbnails for a live session and controls the interval at which thumbnails are generated for the live session.
   */
  public thumbnailConfiguration?: cdk.IResolvable | CfnRecordingConfiguration.ThumbnailConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRecordingConfigurationProps) {
    super(scope, id, {
      "type": CfnRecordingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationConfiguration", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.destinationConfiguration = props.destinationConfiguration;
    this.name = props.name;
    this.recordingReconnectWindowSeconds = props.recordingReconnectWindowSeconds;
    this.renditionConfiguration = props.renditionConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVS::RecordingConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.thumbnailConfiguration = props.thumbnailConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationConfiguration": this.destinationConfiguration,
      "name": this.name,
      "recordingReconnectWindowSeconds": this.recordingReconnectWindowSeconds,
      "renditionConfiguration": this.renditionConfiguration,
      "tags": this.tags.renderTags(),
      "thumbnailConfiguration": this.thumbnailConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRecordingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRecordingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnRecordingConfiguration {
  /**
   * The DestinationConfiguration property type describes the location where recorded videos will be stored.
   *
   * Each member represents a type of destination configuration. For recording, you define one and only one type of destination configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-destinationconfiguration.html
   */
  export interface DestinationConfigurationProperty {
    /**
     * An S3 destination configuration where recorded videos will be stored.
     *
     * See the [S3DestinationConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-s3destinationconfiguration.html) property type for more information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-destinationconfiguration.html#cfn-ivs-recordingconfiguration-destinationconfiguration-s3
     */
    readonly s3?: cdk.IResolvable | CfnRecordingConfiguration.S3DestinationConfigurationProperty;
  }

  /**
   * The S3DestinationConfiguration property type describes an S3 location where recorded videos will be stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-s3destinationconfiguration.html
   */
  export interface S3DestinationConfigurationProperty {
    /**
     * Location (S3 bucket name) where recorded videos will be stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-s3destinationconfiguration.html#cfn-ivs-recordingconfiguration-s3destinationconfiguration-bucketname
     */
    readonly bucketName: string;
  }

  /**
   * The RenditionConfiguration property type describes which renditions should be recorded for a stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-renditionconfiguration.html
   */
  export interface RenditionConfigurationProperty {
    /**
     * A list of which renditions are recorded for a stream, if `renditionSelection` is `CUSTOM` ;
     *
     * otherwise, this field is irrelevant. The selected renditions are recorded if they are available during the stream. If a selected rendition is unavailable, the best available rendition is recorded. For details on the resolution dimensions of each rendition, see [Auto-Record to Amazon S3](https://docs.aws.amazon.com//ivs/latest/userguide/record-to-s3.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-renditionconfiguration.html#cfn-ivs-recordingconfiguration-renditionconfiguration-renditions
     */
    readonly renditions?: Array<string>;

    /**
     * The set of renditions are recorded for a stream.
     *
     * For `BASIC` channels, the `CUSTOM` value has no effect. If `CUSTOM` is specified, a set of renditions can be specified in the `renditions` field. Default: `ALL` .
     *
     * @default - "ALL"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-renditionconfiguration.html#cfn-ivs-recordingconfiguration-renditionconfiguration-renditionselection
     */
    readonly renditionSelection?: string;
  }

  /**
   * The ThumbnailConfiguration property type describes a configuration of thumbnails for recorded video.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html
   */
  export interface ThumbnailConfigurationProperty {
    /**
     * Thumbnail recording mode. Valid values:.
     *
     * - `DISABLED` : Use DISABLED to disable the generation of thumbnails for recorded video.
     * - `INTERVAL` : Use INTERVAL to enable the generation of thumbnails for recorded video at a time interval controlled by the [TargetIntervalSeconds](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-targetintervalseconds) property.
     *
     * *Default* : `INTERVAL`
     *
     * @default - "INTERVAL"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-recordingmode
     */
    readonly recordingMode?: string;

    /**
     * The desired resolution of recorded thumbnails for a stream.
     *
     * Thumbnails are recorded at the selected resolution if the corresponding rendition is available during the stream; otherwise, they are recorded at source resolution. For more information about resolution values and their corresponding height and width dimensions, see [Auto-Record to Amazon S3](https://docs.aws.amazon.com//ivs/latest/userguide/record-to-s3.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-resolution
     */
    readonly resolution?: string;

    /**
     * The format in which thumbnails are recorded for a stream.
     *
     * `SEQUENTIAL` records all generated thumbnails in a serial manner, to the media/thumbnails directory. `LATEST` saves the latest thumbnail in media/thumbnails/latest/thumb.jpg and overwrites it at the interval specified by `targetIntervalSeconds` . You can enable both `SEQUENTIAL` and `LATEST` . Default: `SEQUENTIAL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-storage
     */
    readonly storage?: Array<string>;

    /**
     * The targeted thumbnail-generation interval in seconds. This is configurable (and required) only if [RecordingMode](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-recordingmode) is `INTERVAL` .
     *
     * > Setting a value for `TargetIntervalSeconds` does not guarantee that thumbnails are generated at the specified interval. For thumbnails to be generated at the `TargetIntervalSeconds` interval, the `IDR/Keyframe` value for the input video must be less than the `TargetIntervalSeconds` value. See [Amazon IVS Streaming Configuration](https://docs.aws.amazon.com/ivs/latest/userguide/streaming-config.html) for information on setting `IDR/Keyframe` to the recommended value in video-encoder settings.
     *
     * *Default* : 60
     *
     * *Valid Range* : Minumum value of 1. Maximum value of 60.
     *
     * @default - 60
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-thumbnailconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration-targetintervalseconds
     */
    readonly targetIntervalSeconds?: number;
  }
}

/**
 * Properties for defining a `CfnRecordingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html
 */
export interface CfnRecordingConfigurationProps {
  /**
   * A destination configuration contains information about where recorded video will be stored.
   *
   * See the DestinationConfiguration property type for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-destinationconfiguration
   */
  readonly destinationConfiguration: CfnRecordingConfiguration.DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Recording-configuration name.
   *
   * The value does not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-name
   */
  readonly name?: string;

  /**
   * If a broadcast disconnects and then reconnects within the specified interval, the multiple streams will be considered a single broadcast and merged together.
   *
   * *Default* : `0`
   *
   * @default - 0
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-recordingreconnectwindowseconds
   */
  readonly recordingReconnectWindowSeconds?: number;

  /**
   * A rendition configuration describes which renditions should be recorded for a stream.
   *
   * See the RenditionConfiguration property type for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-renditionconfiguration
   */
  readonly renditionConfiguration?: cdk.IResolvable | CfnRecordingConfiguration.RenditionConfigurationProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-recordingconfiguration-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A thumbnail configuration enables/disables the recording of thumbnails for a live session and controls the interval at which thumbnails are generated for the live session.
   *
   * See the ThumbnailConfiguration property type for more information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-recordingconfiguration.html#cfn-ivs-recordingconfiguration-thumbnailconfiguration
   */
  readonly thumbnailConfiguration?: cdk.IResolvable | CfnRecordingConfiguration.ThumbnailConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `S3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecordingConfigurationS3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  return errors.wrap("supplied properties not correct for \"S3DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecordingConfigurationS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecordingConfigurationS3DestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName)
  };
}

// @ts-ignore TS6133
function CfnRecordingConfigurationS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecordingConfiguration.S3DestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecordingConfiguration.S3DestinationConfigurationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecordingConfigurationDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3", CfnRecordingConfigurationS3DestinationConfigurationPropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecordingConfigurationDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecordingConfigurationDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3": convertCfnRecordingConfigurationS3DestinationConfigurationPropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnRecordingConfigurationDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecordingConfiguration.DestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecordingConfiguration.DestinationConfigurationProperty>();
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnRecordingConfigurationS3DestinationConfigurationPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RenditionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RenditionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecordingConfigurationRenditionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("renditionSelection", cdk.validateString)(properties.renditionSelection));
  errors.collect(cdk.propertyValidator("renditions", cdk.listValidator(cdk.validateString))(properties.renditions));
  return errors.wrap("supplied properties not correct for \"RenditionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecordingConfigurationRenditionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecordingConfigurationRenditionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RenditionSelection": cdk.stringToCloudFormation(properties.renditionSelection),
    "Renditions": cdk.listMapper(cdk.stringToCloudFormation)(properties.renditions)
  };
}

// @ts-ignore TS6133
function CfnRecordingConfigurationRenditionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecordingConfiguration.RenditionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecordingConfiguration.RenditionConfigurationProperty>();
  ret.addPropertyResult("renditions", "Renditions", (properties.Renditions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Renditions) : undefined));
  ret.addPropertyResult("renditionSelection", "RenditionSelection", (properties.RenditionSelection != null ? cfn_parse.FromCloudFormation.getString(properties.RenditionSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThumbnailConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ThumbnailConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecordingConfigurationThumbnailConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordingMode", cdk.validateString)(properties.recordingMode));
  errors.collect(cdk.propertyValidator("resolution", cdk.validateString)(properties.resolution));
  errors.collect(cdk.propertyValidator("storage", cdk.listValidator(cdk.validateString))(properties.storage));
  errors.collect(cdk.propertyValidator("targetIntervalSeconds", cdk.validateNumber)(properties.targetIntervalSeconds));
  return errors.wrap("supplied properties not correct for \"ThumbnailConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecordingConfigurationThumbnailConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecordingConfigurationThumbnailConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RecordingMode": cdk.stringToCloudFormation(properties.recordingMode),
    "Resolution": cdk.stringToCloudFormation(properties.resolution),
    "Storage": cdk.listMapper(cdk.stringToCloudFormation)(properties.storage),
    "TargetIntervalSeconds": cdk.numberToCloudFormation(properties.targetIntervalSeconds)
  };
}

// @ts-ignore TS6133
function CfnRecordingConfigurationThumbnailConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecordingConfiguration.ThumbnailConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecordingConfiguration.ThumbnailConfigurationProperty>();
  ret.addPropertyResult("recordingMode", "RecordingMode", (properties.RecordingMode != null ? cfn_parse.FromCloudFormation.getString(properties.RecordingMode) : undefined));
  ret.addPropertyResult("resolution", "Resolution", (properties.Resolution != null ? cfn_parse.FromCloudFormation.getString(properties.Resolution) : undefined));
  ret.addPropertyResult("storage", "Storage", (properties.Storage != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Storage) : undefined));
  ret.addPropertyResult("targetIntervalSeconds", "TargetIntervalSeconds", (properties.TargetIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetIntervalSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRecordingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRecordingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecordingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationConfiguration", cdk.requiredValidator)(properties.destinationConfiguration));
  errors.collect(cdk.propertyValidator("destinationConfiguration", CfnRecordingConfigurationDestinationConfigurationPropertyValidator)(properties.destinationConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recordingReconnectWindowSeconds", cdk.validateNumber)(properties.recordingReconnectWindowSeconds));
  errors.collect(cdk.propertyValidator("renditionConfiguration", CfnRecordingConfigurationRenditionConfigurationPropertyValidator)(properties.renditionConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("thumbnailConfiguration", CfnRecordingConfigurationThumbnailConfigurationPropertyValidator)(properties.thumbnailConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnRecordingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnRecordingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecordingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "DestinationConfiguration": convertCfnRecordingConfigurationDestinationConfigurationPropertyToCloudFormation(properties.destinationConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RecordingReconnectWindowSeconds": cdk.numberToCloudFormation(properties.recordingReconnectWindowSeconds),
    "RenditionConfiguration": convertCfnRecordingConfigurationRenditionConfigurationPropertyToCloudFormation(properties.renditionConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "ThumbnailConfiguration": convertCfnRecordingConfigurationThumbnailConfigurationPropertyToCloudFormation(properties.thumbnailConfiguration)
  };
}

// @ts-ignore TS6133
function CfnRecordingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecordingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecordingConfigurationProps>();
  ret.addPropertyResult("destinationConfiguration", "DestinationConfiguration", (properties.DestinationConfiguration != null ? CfnRecordingConfigurationDestinationConfigurationPropertyFromCloudFormation(properties.DestinationConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recordingReconnectWindowSeconds", "RecordingReconnectWindowSeconds", (properties.RecordingReconnectWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.RecordingReconnectWindowSeconds) : undefined));
  ret.addPropertyResult("renditionConfiguration", "RenditionConfiguration", (properties.RenditionConfiguration != null ? CfnRecordingConfigurationRenditionConfigurationPropertyFromCloudFormation(properties.RenditionConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("thumbnailConfiguration", "ThumbnailConfiguration", (properties.ThumbnailConfiguration != null ? CfnRecordingConfigurationThumbnailConfigurationPropertyFromCloudFormation(properties.ThumbnailConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IVS::StreamKey` resource specifies an  stream key associated with the referenced channel.
 *
 * Use a stream key to initiate a live stream.
 *
 * @cloudformationResource AWS::IVS::StreamKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-streamkey.html
 */
export class CfnStreamKey extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVS::StreamKey";

  /**
   * Build a CfnStreamKey from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamKey {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStreamKeyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStreamKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The stream-key ARN. For example: `arn:aws:ivs:us-west-2:123456789012:stream-key/g1H2I3j4k5L6`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The stream-key value. For example: `sk_us-west-2_abcdABCDefgh_567890abcdef`
   *
   * @cloudformationAttribute Value
   */
  public readonly attrValue: string;

  /**
   * Channel ARN for the stream.
   */
  public channelArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamKeyProps) {
    super(scope, id, {
      "type": CfnStreamKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "channelArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrValue = cdk.Token.asString(this.getAtt("Value", cdk.ResolutionTypeHint.STRING));
    this.channelArn = props.channelArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVS::StreamKey", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelArn": this.channelArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamKeyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStreamKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-streamkey.html
 */
export interface CfnStreamKeyProps {
  /**
   * Channel ARN for the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-streamkey.html#cfn-ivs-streamkey-channelarn
   */
  readonly channelArn: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivs-streamkey-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivs-streamkey.html#cfn-ivs-streamkey-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnStreamKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelArn", cdk.requiredValidator)(properties.channelArn));
  errors.collect(cdk.propertyValidator("channelArn", cdk.validateString)(properties.channelArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamKeyPropsValidator(properties).assertSuccess();
  return {
    "ChannelArn": cdk.stringToCloudFormation(properties.channelArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStreamKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamKeyProps>();
  ret.addPropertyResult("channelArn", "ChannelArn", (properties.ChannelArn != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}