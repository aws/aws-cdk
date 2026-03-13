import type { IResource } from 'aws-cdk-lib';
import { RemovalPolicy, ArnFormat, Duration, Lazy, Names, Resource, Stack } from 'aws-cdk-lib';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import type { MetricOptions } from 'aws-cdk-lib/aws-cloudwatch';
import { Metric, Unit } from 'aws-cdk-lib/aws-cloudwatch';
import type { IRole, PolicyStatement, AddToResourcePolicyResult } from 'aws-cdk-lib/aws-iam';
import { CfnOriginEndpoint } from 'aws-cdk-lib/aws-mediapackagev2';
import type { IOriginEndpointRef, OriginEndpointReference } from 'aws-cdk-lib/aws-mediapackagev2';
import { ValidationError, UnscopedValidationError, CfnResource } from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IChannel } from './channel';
import type { CdnAuthConfiguration } from './origin-endpoint-policy';
import { OriginEndpointPolicy } from './origin-endpoint-policy';
import { convertDateToString, renderTags } from './shared-helpers';

/**
 * Manifest Filter Keys for manifest filter configuration
 */
export enum ManifestFilterKeys {
  /**
   * Filter for audio bitrate
   */
  AUDIO_BITRATE='audio_bitrate',
  /**
   * Filter for audio channels
   */
  AUDIO_CHANNELS='audio_channels',
  /**
   * Filter for audio sample rate
   */
  AUDIO_SAMPLE_RATE='audio_sample_rate',
  /**
   * Filter for trickplay height
   */
  TRICKPLAY_HEIGHT='trickplay_height',
  /**
   * Filter for video bitrate
   */
  VIDEO_BITRATE='video_bitrate',
  /**
   * Filter for video framerate
   */
  VIDEO_FRAMERATE='video_framerate',
  /**
   * Filter for video height
   */
  VIDEO_HEIGHT='video_height',
  /**
   * Filter for video codec
   */
  VIDEO_CODEC='video_codec',
}

/**
 * Enables you to create filters for your Origin Endpoint.
 *
 * @see https://docs.aws.amazon.com/mediapackage/latest/userguide/manifest-filtering.html
 */
export class ManifestFilter {
  /**
   * Specify only a single manifest filter key and value
   */
  public static single(key: ManifestFilterKeys, value: string | number) {
    return new ManifestFilter(`${key}:${value}`);
  }

  /**
   * Specify a manifest filter key and multiple values
   */
  public static multiple(key: ManifestFilterKeys, value: string[] | number[]) {
    return new ManifestFilter(`${key}:${value.join(',')}`);
  }

  /**
   * Specify a manifest filter key and a value range
   */
  public static range(key: ManifestFilterKeys, start: string | number, end: string | number) {
    if (typeof start != typeof end) throw new UnscopedValidationError('Ensure Manifest Filters types match on range.');
    return new ManifestFilter(`${key}:${start}-${end}`);
  }

  /**
   * Specify a manifest filter key and a custom string
   */
  public static custom(custom: string) {
    return new ManifestFilter(custom);
  }

  /**
   * @param filterString Normalised manifest filter string
   */
  protected constructor(public readonly filterString: string) { }
}

/**
 * Context passed to Manifest._bind() method
 * @internal
 */
export interface ManifestBindContext {
  readonly hlsManifests: CfnOriginEndpoint.HlsManifestConfigurationProperty[];
  readonly llHlsManifests: CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty[];
  readonly dashManifests: CfnOriginEndpoint.DashManifestConfigurationProperty[];
  readonly mssManifests: CfnOriginEndpoint.MssManifestConfigurationProperty[];
  readonly segment?: SegmentConfiguration;
}

/**
 * Manifest to add to Origin Endpoint
 */
export abstract class Manifest {
  /**
   * Specify a manifest configuration for Low Latency HLS.
   *
   * **Note:** Low Latency HLS manifests require TS or CMAF container type.
   * Use with `Segment.ts()` or `Segment.cmaf()`.
   */
  public static lowLatencyHLS(manifest: LowLatencyHlsManifestConfiguration): Manifest {
    return new LowLatencyHlsManifest(manifest);
  }

  /**
   * Specify a manifest configuration for HLS.
   *
   * **Note:** HLS manifests require TS or CMAF container type.
   * Use with `Segment.ts()` or `Segment.cmaf()`.
   */
  public static hls(manifest: HlsManifestConfiguration): Manifest {
    return new HlsManifest(manifest);
  }

  /**
   * Specify a manifest configuration for DASH.
   *
   * **Note:** DASH manifests require CMAF container type.
   * Use with `Segment.cmaf()`.
   */
  public static dash(manifest: DashManifestConfiguration): Manifest {
    return new DashManifest(manifest);
  }

  /**
   * Specify a manifest configuration for MSS.
   *
   * **Note:** MSS manifests require ISM container type.
   * Use with `Segment.ism()`.
   */
  public static mss(manifest: MssManifestConfiguration): Manifest {
    return new MssManifest(manifest);
  }

  /**
   * Called when the manifest is bound to an OriginEndpoint
   * @internal
   */
  public abstract _bind(context: ManifestBindContext): void;
}

/**
 * Validates common manifest configuration properties
 */
function validateManifestConfiguration(config: ManifestConfigurationBase): void {
  if (config.manifestWindow && config.manifestWindow.toSeconds() < 30) {
    throw new UnscopedValidationError('Manifest Window has a minimum value of 30 seconds');
  }
}

/**
 * Validate and modify filter configuration
 * @internal
 */
function validateFilterConfiguration(filterConfig?: FilterConfiguration): CfnOriginEndpoint.FilterConfigurationProperty | undefined {
  if (!filterConfig) return undefined;

  if (filterConfig.clipStartTime && (filterConfig.start || filterConfig.end)) {
    throw new UnscopedValidationError('You cannot specify both ClipStartTime with Start or End in a FilterConfiguration.');
  }

  if (filterConfig.timeDelay && (filterConfig.timeDelay.toSeconds() < 0 || filterConfig.timeDelay.toSeconds() > 1209600)) {
    throw new UnscopedValidationError('Time Delay setting should be defined between 0-1209600 seconds.');
  }

  if (filterConfig.start && filterConfig.end && (filterConfig.end <= filterConfig.start)) {
    throw new UnscopedValidationError('The End parameter needs to be after the Start parameter in a FilterConfiguration.');
  }

  const manifestFilter = filterConfig.manifestFilter ? filterConfig.manifestFilter.map(filter => filter.filterString).join(';') : undefined;
  if (manifestFilter != undefined && (manifestFilter.length < 1 || manifestFilter.length > 1024)) {
    throw new UnscopedValidationError('Manifest filter needs to be between 1-1024 characters in length.');
  }

  return {
    manifestFilter,
    drmSettings: filterConfig.drmSettings ? filterConfig.drmSettings.filter((v, i, a) => a.indexOf(v) === i).join(';') : undefined,
    clipStartTime: filterConfig.clipStartTime ? convertDateToString(filterConfig.clipStartTime) : undefined,
    start: filterConfig.start ? convertDateToString(filterConfig.start) : undefined,
    end: filterConfig.end ? convertDateToString(filterConfig.end) : undefined,
    timeDelaySeconds: filterConfig.timeDelay?.toSeconds(),
  };
}

/**
 * Validate startTag configuration
 * @internal
 */
function validateStartTag(startTag: StartTag, manifestWindow?: Duration, segmentDuration?: Duration): void {
  const timeOffset = startTag.timeOffset;

  // Get segment duration (default is 6 seconds if not specified)
  const segmentDurationSec = segmentDuration?.toSeconds() ?? 6;

  // Get manifest duration (default is 60 seconds if not specified)
  const manifestDurationSec = manifestWindow?.toSeconds() ?? 60;

  // Validate positive offset (from start)
  if (timeOffset > 0) {
    const maxPositiveOffset = manifestDurationSec - (3 * segmentDurationSec);
    if (timeOffset >= maxPositiveOffset) {
      throw new UnscopedValidationError(`StartTag timeOffset (${timeOffset}s) must be less than manifest duration (${manifestDurationSec}s) minus 3 times segment duration (${segmentDurationSec}s). Maximum allowed: ${maxPositiveOffset}s`);
    }
  }

  // Validate negative offset (from live edge)
  if (timeOffset < 0) {
    const absOffset = Math.abs(timeOffset);
    const minNegativeOffset = 3 * segmentDurationSec;

    if (absOffset <= minNegativeOffset) {
      throw new UnscopedValidationError(`StartTag timeOffset (${timeOffset}s) absolute value must be greater than 3 times segment duration (${segmentDurationSec}s). Minimum allowed: -${minNegativeOffset + 0.01}s`);
    }

    if (absOffset >= manifestDurationSec) {
      throw new UnscopedValidationError(`StartTag timeOffset (${timeOffset}s) absolute value must be less than manifest duration (${manifestDurationSec}s)`);
    }
  }
}

/**
 * Build HLS manifest configuration
 * @internal
 */
function buildHlsManifestConfiguration(
  config: HlsManifestConfiguration,
  segmentDuration?: Duration,
): CfnOriginEndpoint.HlsManifestConfigurationProperty {
  if (config.startTag) {
    validateStartTag(config.startTag, config.manifestWindow, segmentDuration);
  }

  return {
    manifestName: config.manifestName,
    childManifestName: config.childManifestName,
    manifestWindowSeconds: config.manifestWindow?.toSeconds(),
    programDateTimeIntervalSeconds: config.programDateTimeInterval?.toSeconds(),
    scteHls: config.scteAdMarkerHls ? { adMarkerHls: config.scteAdMarkerHls } : undefined,
    startTag: config.startTag,
    urlEncodeChildManifest: config.urlEncodeChildManifest,
    filterConfiguration: validateFilterConfiguration(config.filterConfiguration),
  };
}

/**
 * Build DASH manifest configuration
 * @internal
 */
function buildDashManifestConfiguration(
  config: DashManifestConfiguration,
  segment?: SegmentConfiguration,
): CfnOriginEndpoint.DashManifestConfigurationProperty {
  if (config.minBufferTime && (config.minBufferTime.toSeconds() < 1 || config.minBufferTime.toSeconds() > 3600)) {
    throw new UnscopedValidationError('Min buffer time has a range from 1 sec. to 3600 sec.');
  }
  if (config.minUpdatePeriod && (config.minUpdatePeriod.toSeconds() < 1 || config.minUpdatePeriod.toSeconds() > 3600)) {
    throw new UnscopedValidationError('Min update period option has a range from 1 sec. to 3600 sec.');
  }
  if (config.scteDashAdMarker && (!segment?.scteFilter || segment.scteFilter?.length === 0)) {
    throw new UnscopedValidationError('SCTE Filter must be configured with DashAdMarker Configuration');
  }

  return {
    manifestName: config.manifestName,
    baseUrls: config.baseUrls,
    compactness: config.compactness,
    drmSignaling: config.drmSignalling,
    dvbSettings: config.dvbSettings,
    profiles: config.profiles,
    programInformation: config.programInformation,
    subtitleConfiguration: config.subtitleConfiguration,
    manifestWindowSeconds: config.manifestWindow?.toSeconds(),
    minBufferTimeSeconds: config.minBufferTime?.toSeconds(),
    minUpdatePeriodSeconds: config.minUpdatePeriod?.toSeconds(),
    suggestedPresentationDelaySeconds: config.suggestedPresentationDelay?.toSeconds(),
    segmentTemplateFormat: config.segmentTemplateFormat,
    periodTriggers: config.periodTriggers,
    scteDash: segment?.scteFilter ? {
      adMarkerDash: config.scteDashAdMarker,
    } : undefined,
    utcTiming: config.utcTimingMode || config.utcTimingSource ? {
      timingMode: config.utcTimingMode,
      timingSource: config.utcTimingSource,
    } : undefined,
    filterConfiguration: validateFilterConfiguration(config.filterConfiguration),
  };
}

/**
 * Build MSS manifest configuration
 * @internal
 */
function buildMssManifestConfiguration(config: MssManifestConfiguration): CfnOriginEndpoint.MssManifestConfigurationProperty {
  return {
    manifestName: config.manifestName,
    manifestLayout: config.manifestLayout,
    manifestWindowSeconds: config.manifestWindow?.toSeconds(),
    filterConfiguration: validateFilterConfiguration(config.filterConfiguration),
  };
}

/**
 * HLS Manifest implementation
 */
class HlsManifest extends Manifest {
  constructor(private readonly config: HlsManifestConfiguration) {
    super();
  }

  public _bind(context: ManifestBindContext): void {
    validateManifestConfiguration(this.config);
    context.hlsManifests.push(buildHlsManifestConfiguration(this.config, context.segment?.segmentDuration));
  }
}

/**
 * Low Latency HLS Manifest implementation
 */
class LowLatencyHlsManifest extends Manifest {
  constructor(private readonly config: LowLatencyHlsManifestConfiguration) {
    super();
  }

  public _bind(context: ManifestBindContext): void {
    validateManifestConfiguration(this.config);
    context.llHlsManifests.push(buildHlsManifestConfiguration(this.config, context.segment?.segmentDuration));
  }
}

/**
 * DASH Manifest implementation
 */
class DashManifest extends Manifest {
  constructor(private readonly config: DashManifestConfiguration) {
    super();
  }

  public _bind(context: ManifestBindContext): void {
    validateManifestConfiguration(this.config);

    if (this.config.utcTimingMode === DashUtcTimingMode.UTC_DIRECT && this.config.utcTimingSource) {
      throw new UnscopedValidationError('UTC Direct configured with a timing source, ensure timing source is undefined to use UTC Direct.');
    }

    context.dashManifests.push(buildDashManifestConfiguration(this.config, context.segment));
  }
}

/**
 * MSS Manifest implementation
 */
class MssManifest extends Manifest {
  constructor(private readonly config: MssManifestConfiguration) {
    super();
  }

  public _bind(context: ManifestBindContext): void {
    validateManifestConfiguration(this.config);
    context.mssManifests.push(buildMssManifestConfiguration(this.config));
  }
}

/**
 * The type of container to attach to this origin endpoint.
 * A container type is a file format that encapsulates one or more media streams, such as audio and video, into a single file. You can't change the container type after you create the endpoint.
 */
export enum ContainerType {
  /**
   * TS Container Type
   */
  TS='TS',
  /**
   * CMAF Container Type
   */
  CMAF='CMAF',
  /**
   * ISM Container Type (Microsoft Smooth Streaming)
   */
  ISM='ISM',
}

/**
 * Encryption method options
 */
/**
 * Encryption methods for CMAF container type.
 */
export enum CmafEncryptionMethod {
  /**
   * Common Encryption Scheme (CENC) - compatible with PlayReady, Widevine, and Irdeto DRM systems.
   */
  CENC = 'CENC',
  /**
   * Common Encryption Scheme with CBCS mode - compatible with PlayReady, Widevine, and FairPlay DRM systems.
   */
  CBCS = 'CBCS',
}

/**
 * Encryption methods for TS container type.
 */
export enum TsEncryptionMethod {
  /**
   * AES-128 encryption - requires Clear Key AES 128 DRM system.
   */
  AES_128 = 'AES_128',
  /**
   * Sample-level AES encryption - requires FairPlay DRM system.
   */
  SAMPLE_AES = 'SAMPLE_AES',
}

/**
 * A collection of audio encryption presets.
 */
export enum PresetSpeke20Audio {
  /**
   * Use one content key to encrypt all of the audio tracks in your stream.
   */
  PRESET_AUDIO_1='PRESET-AUDIO-1',
  /**
   * Use one content key to encrypt all of the stereo audio tracks and one content key to encrypt all of the multichannel audio tracks.
   */
  PRESET_AUDIO_2='PRESET-AUDIO-2',
  /**
   * Use one content key to encrypt all of the stereo audio tracks, one content key to encrypt all of the multichannel audio tracks with 3 to 6 channels,
   * and one content key to encrypt all of the multichannel audio tracks with more than 6 channels.
   */
  PRESET_AUDIO_3='PRESET-AUDIO-3',
  /**
   * Use the same content key for all of the audio and video tracks in your stream.
   */
  SHARED='SHARED',
  /**
   * Don't encrypt any of the audio tracks in your stream.
   */
  UNENCRYPTED='UNENCRYPTED',
}

/**
 * The SPEKE Version 2.0 preset video associated with the encryption contract configuration of the origin endpoint.
 * A collection of video encryption presets.
 */
export enum PresetSpeke20Video {
  /**
   * Use one content key to encrypt all of the video tracks in your stream.
   */
  PRESET_VIDEO_1='PRESET-VIDEO-1',
  /**
   * Use one content key to encrypt all of the SD video tracks and one content key for all HD and higher resolutions video tracks.
   */
  PRESET_VIDEO_2='PRESET-VIDEO-2',
  /**
   * Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks and one content key for all UHD video tracks.
   */
  PRESET_VIDEO_3='PRESET-VIDEO-3',
  /**
   * Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks,
   * one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
   */
  PRESET_VIDEO_4='PRESET-VIDEO-4',
  /**
   * Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks,
   * one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
   */
  PRESET_VIDEO_5='PRESET-VIDEO-5',
  /**
   * Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks
   * and one content key for all UHD video tracks.
   */
  PRESET_VIDEO_6='PRESET-VIDEO-6',
  /**
   * Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
   */
  PRESET_VIDEO_7='PRESET-VIDEO-7',
  /**
   * Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1
   * video tracks and one content key for all UHD2 video tracks.
   */
  PRESET_VIDEO_8='PRESET-VIDEO-8',
  /**
   * Use the same content key for all of the video and audio tracks in your stream.
   */
  SHARED='SHARED',
  /**
   * Don't encrypt any of the video tracks in your stream.
   */
  UNENCRYPTED='UNENCRYPTED',
}

/**
 * Endpoint error configuration options.
 */
export enum EndpointErrorConfiguration {
  /**
   * The manifest stalled and there are no new segments or parts.
   */
  STALE_MANIFEST='STALE_MANIFEST',
  /**
   * There is a gap in the manifest.
   */
  INCOMPLETE_MANIFEST='INCOMPLETE_MANIFEST',
  /**
   * Key rotation is enabled but we're unable to fetch the key for the current key period.
   */
  MISSING_DRM_KEY='MISSING_DRM_KEY',
  /**
   * The segments which contain slate content are considered to be missing content.
   */
  SLATE_INPUT='SLATE_INPUT',
}

/**
 * SCTE-35 message type options available.
 */
export enum ScteMessageType {
  /**
   * Option for SPLICE_INSERT.
   */
  SPLICE_INSERT='SPLICE_INSERT',
  /**
   * Option for BREAK.
   */
  BREAK='BREAK',
  /**
   * Option for PROVIDER_ADVERTISEMENT.
   */
  PROVIDER_ADVERTISEMENT='PROVIDER_ADVERTISEMENT',
  /**
   * Option for DISTRIBUTOR_ADVERTISEMENT.
   */
  DISTRIBUTOR_ADVERTISEMENT='DISTRIBUTOR_ADVERTISEMENT',
  /**
   * Option for PROVIDER_PLACEMENT_OPPORTUNITY.
   */
  PROVIDER_PLACEMENT_OPPORTUNITY='PROVIDER_PLACEMENT_OPPORTUNITY',
  /**
   * Option for DISTRIBUTOR_PLACEMENT_OPPORTUNITY.
   */
  DISTRIBUTOR_PLACEMENT_OPPORTUNITY='DISTRIBUTOR_PLACEMENT_OPPORTUNITY',
  /**
   * Option for PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY.
   */
  PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY='PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY',
  /**
   * Option for DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY.
   */
  DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY='DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY',
  /**
   * Option for PROGRAM.
   */
  PROGRAM='PROGRAM',
}

/**
 * Controls whether SCTE-35 messages are included in segment files.
 */
export enum ScteInSegments {
  /**
   * SCTE-35 messages are not included in segments.
   */
  NONE = 'NONE',
  /**
   * SCTE-35 messages are embedded in segment data.
   *
   * For DASH manifests, when set to ALL, an InbandEventStream tag signals
   * that SCTE messages are present in segments.
   */
  ALL = 'ALL',
}

/**
 * Origin Endpoint interface
 */
export interface IOriginEndpoint extends IResource, IOriginEndpointRef {
  /**
   * The name of the channel group associated with the origin endpoint configuration.
   *
   * @attribute
   */
  readonly channelGroupName: string;

  /**
   * The channel name associated with the origin endpoint.
   *
   * @attribute
   */
  readonly channelName: string;

  /**
   * The name of the origin endpoint associated with the origin endpoint configuration.
   *
   * @attribute
   */
  readonly originEndpointName: string;

  /**
   * The Amazon Resource Name (ARN) of the origin endpoint.
   *
   * @attribute
   */
  readonly originEndpointArn: string;

  /**
   * Configure origin endpoint policy.
   *
   * You can only add 1 OriginEndpointPolicy to an OriginEndpoint.
   * If you have already defined one, it will append to the policy already created.
   *
   * @param statement - The policy statement to add
   * @param cdnAuth - Optional CDN authorization configuration. Only the first CDN auth configuration is used if provided multiple times.
   */
  addToResourcePolicy(statement: PolicyStatement, cdnAuth?: CdnAuthConfiguration): AddToResourcePolicyResult;

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric.
   * @param props metric options.
   */
  metric(metricName: string, props?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress Bytes
   *
   * @default - sum over 60 seconds
   */
  metricIngressBytes(options?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Bytes
   *
   * @default - sum over 60 seconds
   */
  metricEgressBytes(props?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress response time
   *
   * @default - average over 60 seconds
   */
  metricIngressResponseTime(props?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Response time
   *
   * @default - average over 60 seconds
   */
  metricEgressResponseTime(props?: MetricOptions): Metric;

  /**
   * Returns Metric for Egress Request Count
   *
   * @default - sum over 60 seconds
   */
  metricEgressRequestCount(props?: MetricOptions): Metric;

  /**
   * Returns Metric for Ingress Request Count
   *
   * @default - sum over 60 seconds
   */
  metricIngressRequestCount(props?: MetricOptions): Metric;
}

/**
 * DRM settings keys for manifest filter configuration.
 */
export enum DrmSettingsKey {
  /**
   * Exclude EXT-X-SESSION-KEY tags from HLS and LL-HLS multivariant playlists.
   *
   * This can improve compatibility with legacy HLS clients that have issues
   * processing session keys, or provide more granular access control when
   * using manifest filtering.
   */
  EXCLUDE_SESSION_KEYS = 'exclude_session_keys',
}

/**
 * Filter configuration includes settings for manifest filtering, start and end times, and time delay that apply to all of your egress requests for this manifest.
 */
export interface FilterConfiguration {
  /**
   * Optionally specify the clip start time for all of your manifest egress requests.
   * When you include clip start time, note that you cannot use clip start time query parameters for this manifest's endpoint URL.
   *
   * This will be converted to a UTC timestamp.
   *
   * @default - No clip start time
   */
  readonly clipStartTime?: Date;
  /**
   * Optionally specify the end time for all of your manifest egress requests.
   * When you include end time, note that you cannot use end time query parameters for this manifest's endpoint URL.
   *
   * This will be converted to a UTC timestamp.
   *
   * @default - No end time
   */
  readonly end?: Date;
  /**
   * Optionally specify the start time for all of your manifest egress requests.
   * When you include start time, note that you cannot use start time query parameters for this manifest's endpoint URL.
   *
   * This will be converted to a UTC timestamp.
   *
   * @default - No start time
   */
  readonly start?: Date;
  /**
   * Optionally specify one or more manifest filters for all of your manifest egress requests.
   * When you include a manifest filter, note that you cannot use an identical manifest filter query parameter for this manifest's endpoint URL.
   *
   * @default - No manifest filters
   */
  readonly manifestFilter?: ManifestFilter[];
  /**
   * Optionally specify the time delay for all of your manifest egress requests. Enter a value that is smaller than your endpoint's startover window.
   * When you include time delay, note that you cannot use time delay query parameters for this manifest's endpoint URL.
   *
   * @default - No time delay
   */
  readonly timeDelay?: Duration;
  /**
   * DRM settings for manifest egress requests.
   *
   * When you include a DRM setting, note that you cannot use an identical
   * DRM setting query parameter for this manifest's endpoint URL.
   *
   * @default - No DRM settings
   */
  readonly drmSettings?: DrmSettingsKey[];
}

/**
 * StartTag Options
 */
export interface StartTagOptions {
  /**
   * Use precise
   *
   * @default false
   */
  readonly precise?: boolean;
}

/**
 * Helper class for creating EXT-X-START tags in HLS playlists.
 *
 * The EXT-X-START tag indicates a preferred point at which to start playing a playlist.
 */
export class StartTag {
  /**
   * Create a start tag with a time offset.
   *
   * @param timeOffset The time offset in seconds. Can be positive (forward from start) or negative (back from live edge).
   *   - If positive: must be less than (manifest duration - 3 × segment duration)
   *   - If negative: absolute value must be greater than (3 × segment duration) and less than manifest duration
   * @param options Additional options
   */
  public static of(timeOffset: number, options?: StartTagOptions): StartTag {
    return {
      timeOffset,
      precise: options && options.precise !== undefined ? options.precise : undefined,
    };
  }

  /**
   * Create a start tag with precise positioning enabled.
   *
   * When PRECISE=YES, clients should start playback at the exact specified point.
   *
   * @param timeOffset The time offset in seconds (positive or negative)
   */
  public static withPrecise(timeOffset: number): StartTag {
    return {
      timeOffset,
      precise: true,
    };
  }
}

/**
 * Configuration for EXT-X-START tag in HLS playlists.
 *
 * Use the `StartTag` helper class to create instances with validation.
 */
export interface StartTag {
  /**
   * Specify the value for PRECISE within your EXT-X-START tag.
   */
  readonly precise?: boolean;
  /**
   * Specify the value for TIME-OFFSET within your EXT-X-START tag. Enter a signed floating point value which, if positive, must be less than the configured
   * manifest duration minus three times the configured segment target duration.
   * If negative, the absolute value must be larger than three times the configured segment target duration, and the absolute value must be smaller than
   * the configured manifest duration.
   */
  timeOffset: number;
}

/**
 * Base manifest configuration.
 */
interface ManifestConfigurationBase {
  /**
   * Filter configuration includes settings for manifest filtering, start and end times, and time delay that apply to all of your egress requests for this manifest.
   *
   * https://docs.aws.amazon.com/mediapackage/latest/userguide/manifest-filter-query-parameters.html
   * @default - No filter configuration
   */
  readonly filterConfiguration?: FilterConfiguration;
  /**
   * The total duration (in seconds) of the manifest's content.
   *
   * @default 60
   */
  readonly manifestWindow?: Duration;
}

/**
 * Choose how ad markers are included in the packaged content.
 */
export enum AdMarkerDash {
  /**
   * Option for BINARY - The SCTE-35 marker is expressed as a hex-string (Base64 string) rather than full XML.
   */
  BINARY='BINARY',
  /**
   * Option for XML - The SCTE marker is expressed fully in XML.
   */
  XML='XML',
}

/**
 * Choose how SCTE-35 ad markers are included in HLS and LL-HLS manifests.
 */
export enum AdMarkerHls {
  /**
   * Insert EXT-X-DATERANGE tags to signal ad content.
   */
  DATERANGE = 'DATERANGE',
  /**
   * Insert enhanced SCTE-35 tags for ad content.
   */
  SCTE35_ENHANCED = 'SCTE35_ENHANCED',
}

/**
 * The type of variable that MediaPackage uses in the media attribute of the SegmentTemplate tag.
 */
export enum SegmentTemplateFormat {
  /**
   * Option for number with timeline.
   */
  NUMBER_WITH_TIMELINE='NUMBER_WITH_TIMELINE',
}

/**
 * The UTC timing mode for DASH.
 */
export enum DashUtcTimingMode {
  /**
   * Option for HTTP_HEAD.
   */
  HTTP_HEAD='HTTP_HEAD',
  /**
   * Option for HTTP_ISO.
   */
  HTTP_ISO='HTTP_ISO',
  /**
   * Option for HTTP_XSDATE.
   */
  HTTP_XSDATE='HTTP_XSDATE',
  /**
   * Option for UTC_DIRECT.
   */
  UTC_DIRECT='UTC_DIRECT',
}

/**
 * Options for triggers which cause AWS Elemental MediaPackage to create media presentation description (MPD) periods in the output manifest.
 */
export enum DashPeriodTriggers {
  /**
   * Option for AVAILS.
   */
  AVAILS='AVAILS',
  /**
   * Option for DRM_KEY_ROTATION.
   */
  DRM_KEY_ROTATION='DRM_KEY_ROTATION',
  /**
   * Option for SOURCE_CHANGES.
   */
  SOURCE_CHANGES='SOURCE_CHANGES',
  /**
   * Option for SOURCE_DISRUPTIONS.
   */
  SOURCE_DISRUPTIONS='SOURCE_DISRUPTIONS',
  /**
   * Option for NONE.
   */
  NONE='NONE',
}

/**
 * DRM signaling determines the way DASH manifest signals the DRM content.
 */
export enum DrmSignalling {
  /**
   * Option for INDIVIDUAL.
   */
  INDIVIDUAL='INDIVIDUAL',
  /**
   * Option for REFERENCED.
   */
  REFERENCED='REFERENCED',
}

/**
 * STANDARD indicates a default manifest, which is compacted. NONE indicates a full manifest.
 */
export enum DashManifestCompactness {
  /**
   * STANDARD
   */
  STANDARD='STANDARD',
  /**
   * NONE
   */
  NONE='NONE',
}

/**
 * The base URLs to use for retrieving segments. You can specify multiple locations and indicate the
 * priority and weight for when each should be used, for use in multi-CDN workflows.
 */
export interface DashBaseUrlProperty {
  /**
   * For use with DVB-DASH profiles only. The priority of this location for serving segments. The lower the number, the higher the priority.
   *
   * @default - No priority specified
   */
  readonly dvbPriority?: number;
  /**
   * For use with DVB-DASH profiles only. The weighting for source locations that have the same priority.
   *
   * @default - No weight specified
   */
  readonly dvbWeight?: number;
  /**
   * The name of the source location.
   *
   * @default - No service location specified
   */
  readonly serviceLocation?: string;
  /**
   * A source location for segments.
   */
  readonly url: string;
}

/**
 * For use with DVB-DASH profiles only. The settings for error reporting from the playback device
 * that you want AWS Elemental MediaPackage to pass through to the manifest.
 */
export interface DashDvbMetricsReporting {
  /**
   * The number of playback devices per 1000 that will send error reports to the reporting URL.
   * This represents the probability that a playback device will be a reporting player for this session.
   *
   * @default - No probability specified
   */
  readonly probability?: number;
  /**
   * The URL where playback devices send error reports.
   */
  readonly reportingUrl: string;
}

/**
 * For use with DVB-DASH profiles only. The settings for font downloads that you want AWS Elemental MediaPackage to pass through to the manifest.
 */
export interface DashDvbFontDownload {
  /**
   * The fontFamily name for subtitles, as described in EBU-TT-D Subtitling Distribution Format.
   * @external https://tech.ebu.ch/publications/tech3380
   *
   * @default - No font family specified
   */
  readonly fontFamily?: string;
  /**
   * The mimeType of the resource that's at the font download URL.
   * For information about font MIME types, see the MPEG-DASH Profile for Transport of ISO BMFF Based DVB Services over IP Based Networks document.
   *
   * @external https://dvb.org/wp-content/uploads/2021/06/A168r4_MPEG-DASH-Profile-for-Transport-of-ISO-BMFF-Based-DVB-Services_Draft-ts_103-285-v140_November_2021.pdf
   * @default - No MIME type specified
   */
  readonly mimeType?: string;
  /**
   * The URL for downloading fonts for subtitles.
   *
   * @default - No font download URL specified
   */
  readonly url?: string;
}

/**
 * The font download and error reporting information that you want MediaPackage to pass through to the manifest.
 */
export interface DashDvbSettings {
  /**
   * Playback device error reporting settings.
   *
   * @default - No error metrics configured
   */
  readonly errorMetrics?: DashDvbMetricsReporting[];
  /**
   * Subtitle font settings.
   *
   * @default - No font download configured
   */
  readonly fontDownload?: DashDvbFontDownload;
}

/**
 * Details about the content that you want MediaPackage to pass through in the manifest to the playback device.
 */
export interface DashProgramInformation {
  /**
   * A copyright statement about the content.
   *
   * @default - No copyright information
   */
  readonly copyright?: string;
  /**
   * The language code for this manifest.
   *
   * @default - No language code specified
   */
  readonly languageCode?: string;
  /**
   * An absolute URL that contains more information about this content.
   *
   * @default - No additional information URL
   */
  readonly moreInformationUrl?: string;
  /**
   * Information about the content provider.
   *
   * @default - No source information
   */
  readonly source?: string;
  /**
   * The title for the manifest.
   *
   * @default - No title specified
   */
  readonly title?: string;
}

/**
 * Options for TTML Profile
 */
export enum TtmlProfile {
  /**
   * IMSC_1
   */
  IMSC_1='IMSC_1',
  /**
   * EBU_TT_D_101
   */
  EBU_TT_D_101='EBU_TT_D_101',
}
/**
 * DASH TTML Config
 */
export interface DashTtmlConfiguration {
  /**
   * The profile that MediaPackage uses when signaling subtitles in the manifest. IMSC is the default profile. EBU-TT-D produces subtitles that are compliant with the EBU-TT-D TTML profile. MediaPackage passes through subtitle styles to the manifest.
   * For more information about EBU-TT-D subtitles, see EBU-TT-D Subtitling Distribution Format.
   *
   * @external https://tech.ebu.ch/publications/tech3380
   */
  readonly ttmlProfile: TtmlProfile;

}
/**
 * Subtitle config
 */
export interface DashSubtitleConfiguration {
  /**
   * Settings for TTML subtitles.
   *
   * @default - No TTML configuration
   */
  readonly ttmlConfiguration?: DashTtmlConfiguration;
}

/**
 * The layout of the MSS manifest.
 */
export enum MssManifestLayout {
  /**
   * Full manifest layout.
   */
  FULL = 'FULL',
  /**
   * Compact manifest layout.
   */
  COMPACT = 'COMPACT',
}

/**
 * The MSS manifest configuration associated with the origin endpoint.
 */
export interface MssManifestConfiguration extends ManifestConfigurationBase {
  /**
   * The name of the manifest associated with the MSS manifest configuration.
   */
  readonly manifestName: string;
  /**
   * The layout of the MSS manifest.
   *
   * @default MssManifestLayout.FULL
   */
  readonly manifestLayout?: MssManifestLayout;
}

/**
 * The DASH manifest configuration associated with the origin endpoint.
 */
export interface DashManifestConfiguration extends ManifestConfigurationBase {
  /**
   * The base URLs to use for retrieving segments.
   *
   * @default - No base URLs specified
   */
  readonly baseUrls?: DashBaseUrlProperty[];
  /**
   * The layout of the DASH manifest that MediaPackage produces.
   *
   * @default DashManifestCompactness.STANDARD
   */
  readonly compactness?: DashManifestCompactness;
  /**
   * For endpoints that use the DVB-DASH profile only.
   *
   * @default - No DVB settings
   */
  readonly dvbSettings?: DashDvbSettings;
  /**
   * The profile that the output is compliant with.
   *
   * @default - No profiles specified
   */
  readonly profiles?: string[];
  /**
   * Details about the content that you want MediaPackage to pass through in the manifest to the playback device.
   *
   * @default - No program information
   */
  readonly programInformation?: DashProgramInformation;
  /**
   * The configuration for DASH subtitles.
   *
   * @default - No subtitle configuration
   */
  readonly subtitleConfiguration?: DashSubtitleConfiguration;
  /**
   * The name of the manifest associated with the DASH manifest configuration.
   */
  readonly manifestName: string;
  /**
   * DRM signaling determines the way DASH manifest signals the DRM content.
   *
   * @default - No DRM signaling specified
   */
  readonly drmSignalling?: DrmSignalling;
  /**
   * The minimum amount of content that the player must keep available in the buffer.
   *
   * @default 5
   */
  readonly minBufferTime?: Duration;
  /**
   * The minimum amount of time for the player to wait before requesting an updated manifest.
   *
   * @default 2
   */
  readonly minUpdatePeriod?: Duration;
  /**
   * Specify what triggers cause AWS Elemental MediaPackage to create media presentation description (MPD) periods in the output manifest.
   *
   * @default [DashPeriodTriggers.AVAILS, DashPeriodTriggers.DRM_KEY_ROTATION, DashPeriodTriggers.SOURCE_CHANGES, DashPeriodTriggers.SOURCE_DISRUPTIONS]
   */
  readonly periodTriggers?: DashPeriodTriggers[];
  /**
   * Choose how ad markers are included in the packaged content. If you include ad markers in the content stream in your upstream encoders,
   * then you need to inform MediaPackage what to do with the ad markers in the output.
   *
   * To choose this option STCE filtering needs to be enabled.
   *
   * @default AdMarkerDash.XML
   */
  readonly scteDashAdMarker?: AdMarkerDash;
  /**
   * The type of variable that MediaPackage uses in the media attribute of the SegmentTemplate tag.
   *
   * @default SegmentTemplateFormat.NUMBER_WITH_TIMELINE
   */
  readonly segmentTemplateFormat?: SegmentTemplateFormat;
  /**
   * The amount of time that the player should be from the end of the manifest.
   *
   * @default 10
   */
  readonly suggestedPresentationDelay?: Duration;
  /**
   * The UTC timing mode.
   *
   * @default DashUtcTimingMode.UTC_DIRECT
   */
  readonly utcTimingMode?: DashUtcTimingMode;
  /**
   * The the method that the player uses to synchronize to coordinated universal time (UTC) wall clock time.
   *
   * @default undefined - No value is specified
   */
  readonly utcTimingSource?: string;
}

/**
 * The HLS manifest configuration associated with the origin endpoint.
 */
export interface HlsManifestConfiguration extends ManifestConfigurationBase {
  /**
   * The name of the manifest associated with the HLS manifest configuration.
   */
  readonly manifestName: string;
  /**
   * The name of the child manifest associated with the HLS manifest configuration.
   *
   * @default - No child manifest name specified
   */
  readonly childManifestName?: string;
  /**
   * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify.
   * If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest.
   * The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player.
   *
   * @default - No program date time interval
   */
  readonly programDateTimeInterval?: Duration;
  /**
   * The SCTE-35 HLS configuration associated with the HLS manifest configuration of the origin endpoint.
   *
   * @default - No SCTE ad marker configuration
   */
  readonly scteAdMarkerHls?: AdMarkerHls;
  /**
   * Insert EXT-X-START tag in the manifest with the configured settings
   *
   * @default - No start tag
   */
  readonly startTag?: StartTag;
  /**
   * When enabled, MediaPackage URL-encodes the query string for API requests for HLS child manifests to comply with AWS Signature Version 4 (SigV4) signature signing protocol.
   * For more information, see AWS Signature Version 4 for API requests in AWS Identity and Access Management User Guide.
   *
   * @external https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html
   * @default false
   */
  readonly urlEncodeChildManifest?: boolean;
}

/**
 * Specify a low-latency HTTP live streaming (LL-HLS) manifest configuration.
 */
export interface LowLatencyHlsManifestConfiguration extends ManifestConfigurationBase {
  /**
   * A short string that's appended to the endpoint URL. The manifest name creates a unique path to this endpoint.
   * If you don't enter a value, MediaPackage uses the default manifest name, index. MediaPackage automatically inserts the format extension, such as .m3u8.
   * You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest.
   * The manifestName on the HLSManifest object overrides the manifestName you provided on the originEndpoint object.
   */
  readonly manifestName: string;
  /**
   * The name of the child manifest associated with the low-latency HLS (LL-HLS) manifest configuration of the origin endpoint.
   *
   * @default - No child manifest name specified
   */
  readonly childManifestName?: string;
  /**
   * Inserts EXT-X-PROGRAM-DATE-TIME tags in the output manifest at the interval that you specify.
   * If you don't enter an interval, EXT-X-PROGRAM-DATE-TIME tags aren't included in the manifest.
   * The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player.
   *
   * @default - No program date time interval
   */
  readonly programDateTimeInterval?: Duration;
  /**
   * The SCTE-35 HLS configuration associated with the low-latency HLS (LL-HLS) manifest configuration of the origin endpoint.
   *
   * @default - No SCTE ad marker configuration
   */
  readonly scteAdMarkerHls?: AdMarkerHls;
  /**
   * Insert EXT-X-START tag in the manifest with the configured settings
   *
   * @default - No start tag
   */
  readonly startTag?: StartTag;
  /**
   * When enabled, MediaPackage URL-encodes the query string for API requests for HLS child manifests to comply with AWS Signature Version 4 (SigV4) signature signing protocol.
   * For more information, see AWS Signature Version 4 for API requests in AWS Identity and Access Management User Guide.
   *
   * @external https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv.html
   * @default false
   */
  readonly urlEncodeChildManifest?: boolean;
}

/**
 * Configuration parameters for an AWS Elemental MediaPackage V2 Origin Endpoint.
 */
export interface OriginEndpointOptions {
  /**
   * The name of the origin endpoint associated with the origin endpoint configuration.
   * @default autogenerated
   */
  readonly originEndpointName?: string;

  /**
   * The description associated with the origin endpoint.
   *
   * @default undefined - No description is added to Origin Endpoint
   */
  readonly description?: string;

  /**
   * The tags associated with the origin endpoint.
   *
   * @default - No tagging
   */
  readonly tags?: { [key: string]: string };

  /**
   * Manifests configuration for HLS, Low Latency HLS and DASH.
   */
  readonly manifests: Manifest[];

  /**
   * The size of the window to specify a window of the live stream that's available for on-demand viewing. Viewers can start-over or catch-up on content that falls within the window.
   *
   * @default 900
   */
  readonly startoverWindow?: Duration;

  /**
   * The segment associated with the origin endpoint.
   *
   * Inside the segment configuration you can define options such as encryption, SPEKE parameters and other
   * general segment configurations.
   *
   * Use Segment.ts() or Segment.cmaf() to create the configuration.
   */
  readonly segment: SegmentConfiguration;

  /**
   * The failover settings for the endpoint.
   *
   * @default undefined - No force endpoint configuration is configured
   */
  readonly forceEndpointConfigurationConditions?: EndpointErrorConfiguration[];

  /**
   * Provide access to MediaPackage V2 Origin Endpoint via secret header.
   *
   * @default undefined - Not configured on endpoint
   */
  readonly cdnAuth?: CdnAuthConfiguration;

  /**
   * Policy to apply when the origin endpoint is removed from the stack
   *
   * Even though MediaPackage ChannelGroups, Channels and OriginEndpoints are technically stateful,
   * their contents are transient and it is common to add and remove these while rearchitecting your application.
   * The default is therefore `DESTROY`. Change it to `RETAIN` if the content (in a lookback window) are so
   * valuable that accidentally losing it would be unacceptable.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Properties to set on an Origin Endpoint.
 */
export interface OriginEndpointProps extends OriginEndpointOptions {
  /**
   * The channel associated with the origin endpoint.
   */
  readonly channel: IChannel;
}

/**
 * Represents an Origin Endpoint defined outside of this stack.
 */
export interface OriginEndpointAttributes {
  /**
   * The name that describes the channel group. The name is the primary identifier for the channel group.
   *
   * @attribute
   */
  readonly channelGroupName: string;

  /**
   * The name that describes the channel. The name is the primary identifier for the channel.
   *
   * @attribute
   */
  readonly channelName: string;

  /**
   * The name that describes the origin endpoint.
   *
   * @attribute
   */
  readonly originEndpointName: string;
}

/**
 * The DRM solution provider you're using to protect your content during distribution.
 */
/**
 * DRM systems available for CMAF encryption.
 *
 * CENC supports PlayReady, Widevine, and Irdeto.
 * CBCS supports PlayReady, Widevine, and FairPlay.
 */
export enum CmafDrmSystem {
  /**
   * FairPlay DRM - used with CBCS encryption.
   */
  FAIRPLAY = 'FAIRPLAY',
  /**
   * PlayReady DRM - used with CENC and CBCS encryption.
   */
  PLAYREADY = 'PLAYREADY',
  /**
   * Widevine DRM - used with CENC and CBCS encryption.
   */
  WIDEVINE = 'WIDEVINE',
  /**
   * Irdeto DRM - used with CENC encryption.
   */
  IRDETO = 'IRDETO',
}

/**
 * DRM systems available for TS encryption.
 *
 * SAMPLE_AES uses FairPlay, AES_128 uses Clear Key AES 128.
 */
export enum TsDrmSystem {
  /**
   * FairPlay DRM - used with SAMPLE_AES encryption.
   */
  FAIRPLAY = 'FAIRPLAY',
  /**
   * Clear Key AES 128 - used with AES_128 encryption.
   */
  CLEAR_KEY_AES_128 = 'CLEAR_KEY_AES_128',
}

/**
 * DRM systems available for ISM encryption.
 *
 * ISM only supports PlayReady with CENC.
 */
export enum IsmDrmSystem {
  /**
   * PlayReady DRM.
   */
  PLAYREADY = 'PLAYREADY',
}

/**
 * Base properties common to all SPEKE encryption configurations.
 */
interface SpekeEncryptionPropsBase {
  /**
   * The unique identifier for the content.
   *
   * The service sends this identifier to the key server to identify the current endpoint.
   * How unique you make this identifier depends on how fine-grained you want access controls to be.
   * The service does not permit you to use the same ID for two simultaneous encryption processes.
   */
  readonly resourceId: string;

  /**
   * IAM role for accessing the key provider API.
   *
   * This role must have a trust policy that allows MediaPackage to assume the role,
   * and it must have sufficient permissions to access the key retrieval URL.
   */
  readonly role: IRole;

  /**
   * URL of the SPEKE key provider.
   */
  readonly url: string;

  /**
   * The ARN of the certificate that you imported to AWS Certificate Manager
   * to add content key encryption to this endpoint.
   *
   * For this feature to work, your DRM key provider must support content key encryption.
   *
   * @default - no content key encryption
   */
  readonly certificate?: ICertificate;

  /**
   * Audio encryption preset.
   *
   * @default PresetSpeke20Audio.PRESET_AUDIO_1
   */
  readonly audioPreset?: PresetSpeke20Audio;

  /**
   * Video encryption preset.
   *
   * @default PresetSpeke20Video.PRESET_VIDEO_1
   */
  readonly videoPreset?: PresetSpeke20Video;
}

/**
 * Properties for CMAF SPEKE encryption configuration.
 */
export interface CmafSpekeEncryptionProps extends SpekeEncryptionPropsBase {
  /**
   * The encryption method to use.
   */
  readonly method: CmafEncryptionMethod;

  /**
   * The DRM systems to use for content protection.
   *
   * CENC supports PlayReady, Widevine, and Irdeto.
   * CBCS supports PlayReady, Widevine, and FairPlay.
   */
  readonly drmSystems: CmafDrmSystem[];

  /**
   * Constant initialization vector (32-character hex string).
   *
   * A 128-bit, 16-byte hex value represented by a 32-character string,
   * used in conjunction with the key for encrypting content.
   *
   * @default - MediaPackage generates the IV
   */
  readonly constantInitializationVector?: string;

  /**
   * Key rotation interval.
   *
   * @default - no rotation
   */
  readonly keyRotationInterval?: Duration;

  /**
   * When enabled, DRM metadata is excluded from CMAF segments.
   *
   * @default false
   */
  readonly excludeSegmentDrmMetadata?: boolean;
}

/**
 * Properties for TS SPEKE encryption configuration.
 */
export interface TsSpekeEncryptionProps extends SpekeEncryptionPropsBase {
  /**
   * The encryption method to use.
   */
  readonly method: TsEncryptionMethod;

  /**
   * The DRM systems to use for content protection.
   *
   * @default - FairPlay for SAMPLE_AES, Clear Key AES 128 for AES_128
   */
  readonly drmSystems?: TsDrmSystem[];

  /**
   * Constant initialization vector (32-character hex string).
   *
   * A 128-bit, 16-byte hex value represented by a 32-character string,
   * used in conjunction with the key for encrypting content.
   *
   * @default - MediaPackage generates the IV
   */
  readonly constantInitializationVector?: string;

  /**
   * Key rotation interval.
   *
   * @default - no rotation
   */
  readonly keyRotationInterval?: Duration;
}

/**
 * Properties for ISM SPEKE encryption configuration.
 *
 * ISM only supports CENC encryption with PlayReady DRM.
 * Key rotation and constant initialization vectors are not supported.
 * Audio and video presets default to SHARED.
 */
export interface IsmSpekeEncryptionProps {
  /**
   * The DRM systems to use for content protection.
   *
   * @default - [IsmDrmSystem.PLAYREADY]
   */
  readonly drmSystems?: IsmDrmSystem[];

  /**
   * The unique identifier for the content.
   */
  readonly resourceId: string;

  /**
   * IAM role for accessing the key provider API.
   */
  readonly role: IRole;

  /**
   * URL of the SPEKE key provider.
   */
  readonly url: string;

  /**
   * The ARN of the certificate that you imported to AWS Certificate Manager
   * to add content key encryption to this endpoint.
   *
   * @default - no content key encryption
   */
  readonly certificate?: ICertificate;
}

/**
 * Base class for encryption configurations.
 *
 * Use `CmafEncryption.speke()`, `TsEncryption.speke()`, or `IsmEncryption.speke()` to create instances.
 */
export abstract class EncryptionConfiguration {
  /**
   * @internal
   */
  public abstract _bind(scope: Construct): CfnOriginEndpoint.EncryptionProperty;

  /**
   * @internal
   */
  public abstract _getRole(): IRole | undefined;

  /**
   * @internal
   */
  public abstract _getCertificate(): ICertificate | undefined;
}

/**
 * Encryption configuration for CMAF segments.
 *
 * Use `CmafEncryption.speke()` to create an instance.
 */
export class CmafEncryption extends EncryptionConfiguration {
  /**
   * Create a SPEKE-based encryption configuration for CMAF segments.
   */
  public static speke(props: CmafSpekeEncryptionProps): CmafEncryption {
    if (!props.url.startsWith('https://')) {
      throw new UnscopedValidationError('SPEKE key provider URL must use HTTPS.');
    }
    if (props.method === CmafEncryptionMethod.CENC && props.drmSystems.includes(CmafDrmSystem.FAIRPLAY)) {
      throw new UnscopedValidationError('CENC encryption method does not support FairPlay. Use CBCS for FairPlay.');
    }
    if (props.method === CmafEncryptionMethod.CBCS && props.drmSystems.includes(CmafDrmSystem.IRDETO)) {
      throw new UnscopedValidationError('CBCS encryption method does not support Irdeto. Use CENC for Irdeto.');
    }
    return new CmafEncryption(props);
  }

  private readonly config: CmafSpekeEncryptionProps;
  private constructor(props: CmafSpekeEncryptionProps) {
    super();
    this.config = props;
  }

  /** @internal */
  public _bind(scope: Construct): CfnOriginEndpoint.EncryptionProperty {
    const p = this.config;
    if (p.constantInitializationVector && p.constantInitializationVector.length !== 32) {
      throw new ValidationError('Constant Initialization Vector needs to be 32 characters in length.', scope);
    }
    if (p.keyRotationInterval && (p.keyRotationInterval.toSeconds() < 300 || p.keyRotationInterval.toSeconds() > 31536000)) {
      throw new ValidationError('Key Rotation Interval needs to be between 300-31536000 seconds.', scope);
    }
    return {
      cmafExcludeSegmentDrmMetadata: p.excludeSegmentDrmMetadata,
      constantInitializationVector: p.constantInitializationVector,
      keyRotationIntervalSeconds: p.keyRotationInterval?.toSeconds(),
      encryptionMethod: { cmafEncryptionMethod: p.method },
      spekeKeyProvider: {
        certificateArn: p.certificate?.certificateArn,
        drmSystems: p.drmSystems,
        encryptionContractConfiguration: {
          presetSpeke20Audio: p.audioPreset ?? PresetSpeke20Audio.PRESET_AUDIO_1,
          presetSpeke20Video: p.videoPreset ?? PresetSpeke20Video.PRESET_VIDEO_1,
        },
        url: p.url,
        resourceId: p.resourceId,
        roleArn: p.role.roleArn,
      },
    };
  }

  /** @internal */
  public _getRole(): IRole | undefined { return this.config.role; }

  /** @internal */
  public _getCertificate(): ICertificate | undefined { return this.config.certificate; }
}

/**
 * Encryption configuration for TS segments.
 *
 * Use `TsEncryption.speke()` to create an instance.
 */
export class TsEncryption extends EncryptionConfiguration {
  /**
   * Create a SPEKE-based encryption configuration for TS segments.
   */
  public static speke(props: TsSpekeEncryptionProps): TsEncryption {
    if (!props.url.startsWith('https://')) {
      throw new UnscopedValidationError('SPEKE key provider URL must use HTTPS.');
    }
    return new TsEncryption(props);
  }

  private readonly config: TsSpekeEncryptionProps;
  private constructor(props: TsSpekeEncryptionProps) {
    super();
    this.config = props;
  }

  /** @internal */
  public _bind(scope: Construct): CfnOriginEndpoint.EncryptionProperty {
    const p = this.config;
    const defaultDrm: TsDrmSystem[] = p.method === TsEncryptionMethod.SAMPLE_AES
      ? [TsDrmSystem.FAIRPLAY] : [TsDrmSystem.CLEAR_KEY_AES_128];
    if (p.constantInitializationVector && p.constantInitializationVector.length !== 32) {
      throw new ValidationError('Constant Initialization Vector needs to be 32 characters in length.', scope);
    }
    if (p.keyRotationInterval && (p.keyRotationInterval.toSeconds() < 300 || p.keyRotationInterval.toSeconds() > 31536000)) {
      throw new ValidationError('Key Rotation Interval needs to be between 300-31536000 seconds.', scope);
    }
    return {
      constantInitializationVector: p.constantInitializationVector,
      keyRotationIntervalSeconds: p.keyRotationInterval?.toSeconds(),
      encryptionMethod: { tsEncryptionMethod: p.method },
      spekeKeyProvider: {
        certificateArn: p.certificate?.certificateArn,
        drmSystems: (p.drmSystems ?? defaultDrm).map(d => d.toString()),
        encryptionContractConfiguration: {
          presetSpeke20Audio: p.audioPreset ?? PresetSpeke20Audio.PRESET_AUDIO_1,
          presetSpeke20Video: p.videoPreset ?? PresetSpeke20Video.PRESET_VIDEO_1,
        },
        url: p.url,
        resourceId: p.resourceId,
        roleArn: p.role.roleArn,
      },
    };
  }

  /** @internal */
  public _getRole(): IRole | undefined { return this.config.role; }

  /** @internal */
  public _getCertificate(): ICertificate | undefined { return this.config.certificate; }
}

/**
 * Encryption configuration for ISM (Microsoft Smooth Streaming) segments.
 *
 * ISM only supports CENC encryption with PlayReady DRM.
 * Audio and video presets are always SHARED.
 *
 * Use `IsmEncryption.speke()` to create an instance.
 */
export class IsmEncryption extends EncryptionConfiguration {
  /**
   * Create a SPEKE-based encryption configuration for ISM segments.
   */
  public static speke(props: IsmSpekeEncryptionProps): IsmEncryption {
    if (!props.url.startsWith('https://')) {
      throw new UnscopedValidationError('SPEKE key provider URL must use HTTPS.');
    }
    return new IsmEncryption(props);
  }

  private readonly config: IsmSpekeEncryptionProps;
  private constructor(props: IsmSpekeEncryptionProps) {
    super();
    this.config = props;
  }

  /** @internal */
  public _bind(_scope: Construct): CfnOriginEndpoint.EncryptionProperty {
    const p = this.config;
    return {
      encryptionMethod: { cmafEncryptionMethod: 'CENC' },
      spekeKeyProvider: {
        certificateArn: p.certificate?.certificateArn,
        drmSystems: (p.drmSystems ?? [IsmDrmSystem.PLAYREADY]).map(d => d.toString()),
        encryptionContractConfiguration: {
          presetSpeke20Audio: PresetSpeke20Audio.SHARED,
          presetSpeke20Video: PresetSpeke20Video.SHARED,
        },
        url: p.url,
        resourceId: p.resourceId,
        roleArn: p.role.roleArn,
      },
    };
  }

  /** @internal */
  public _getRole(): IRole | undefined { return this.config.role; }

  /** @internal */
  public _getCertificate(): ICertificate | undefined { return this.config.certificate; }
}

/**
 * The segment configuration, including the segment name, duration, and other configuration values.
 */
export interface SegmentConfiguration {
  /**
   * The container type for this segment (TS or CMAF)
   */
  readonly containerType: ContainerType;
  /**
   * Whether the segment includes I-frame-only streams.
   *
   * @default undefined - Not specified.
   */
  readonly includeIframeOnlyStreams?: boolean;
  /**
   * The SCTE-35 configuration associated with the segment.
   *
   * The SCTE-35 message types that you want to be treated as ad markers in the output.
   *
   * @default - No SCTE filtering
   */
  readonly scteFilter?: ScteMessageType[];
  /**
   * Controls whether SCTE-35 messages are included in segment files.
   *
   * @default - SCTE-35 messages are not included in segments
   */
  readonly scteInSegments?: ScteInSegments;
  /**
   * The duration of the segments.
   *
   * @default 6
   */
  readonly segmentDuration?: Duration;
  /**
   * The name of the segment associated with the origin endpoint.
   *
   * @default segment
   */
  readonly segmentName?: string;
  /**
   * Whether the segment includes DVB subtitles.
   *
   * @default false
   */
  readonly tsIncludeDvbSubtitles?: boolean;
  /**
   * Whether the segment is an audio rendition group.
   *
   * @default false
   */
  readonly tsUseAudioRenditionGroup?: boolean;
  /**
   * Encryption configuration for the segment.
   *
   * @default - No encryption
   */
  readonly encryption?: EncryptionConfiguration;
}

/**
 * Base properties common to all segment configurations.
 */
export interface SegmentPropsBase {
  /**
   * Whether to include I-frame-only streams.
   *
   * @default false
   */
  readonly includeIframeOnlyStreams?: boolean;

  /**
   * Duration of each segment.
   *
   * @default Duration.seconds(6)
   */
  readonly duration?: Duration;

  /**
   * Name of the segment.
   *
   * @default 'segment'
   */
  readonly name?: string;
}

/**
 * Properties for TS (Transport Stream) segment configuration.
 */
export interface TsSegmentProps extends SegmentPropsBase {
  /**
   * SCTE-35 message types to treat as ad markers.
   *
   * @default - no filtering
   */
  readonly scteFilter?: ScteMessageType[];

  /**
   * Controls whether SCTE-35 messages are included in segment files.
   *
   * @default - SCTE-35 messages are not included in segments
   */
  readonly scteInSegments?: ScteInSegments;

  /**
   * Whether to include DVB subtitles.
   *
   * @default false
   */
  readonly includeDvbSubtitles?: boolean;

  /**
   * Whether to use audio rendition groups.
   *
   * @default false
   */
  readonly useAudioRenditionGroup?: boolean;

  /**
   * Encryption configuration for the TS segment.
   *
   * Use `TsEncryption.speke()` to create the configuration.
   *
   * @default - No encryption
   */
  readonly encryption?: TsEncryption;
}

/**
 * Properties for CMAF segment configuration.
 */
export interface CmafSegmentProps extends SegmentPropsBase {
  /**
   * SCTE-35 message types to treat as ad markers.
   *
   * @default - no filtering
   */
  readonly scteFilter?: ScteMessageType[];

  /**
   * Controls whether SCTE-35 messages are included in segment files.
   *
   * @default - SCTE-35 messages are not included in segments
   */
  readonly scteInSegments?: ScteInSegments;

  /**
   * Encryption configuration for the CMAF segment.
   *
   * Use `CmafEncryption.speke()` to create the configuration.
   *
   * @default - No encryption
   */
  readonly encryption?: CmafEncryption;
}

/**
 * Properties for ISM (Microsoft Smooth Streaming) segment configuration.
 */
export interface IsmSegmentProps extends SegmentPropsBase {
  /**
   * Encryption configuration for the ISM segment.
   *
   * Use `IsmEncryption.speke()` to create the configuration.
   *
   * @default - No encryption
   */
  readonly encryption?: IsmEncryption;
}

/**
 * Helper class for creating segment configurations.
 */
export class Segment {
  /**
   * Create a TS (Transport Stream) segment configuration.
   *
   * Use this for endpoints with ContainerType.TS.
   */
  public static ts(props: TsSegmentProps = {}): SegmentConfiguration {
    return {
      containerType: ContainerType.TS,
      includeIframeOnlyStreams: props.includeIframeOnlyStreams,
      scteFilter: props.scteFilter,
      scteInSegments: props.scteInSegments,
      segmentDuration: props.duration,
      segmentName: props.name,
      tsIncludeDvbSubtitles: props.includeDvbSubtitles,
      tsUseAudioRenditionGroup: props.useAudioRenditionGroup,
      encryption: props.encryption,
    };
  }

  /**
   * Create a CMAF segment configuration.
   *
   * Use this for endpoints with ContainerType.CMAF.
   */
  public static cmaf(props: CmafSegmentProps = {}): SegmentConfiguration {
    return {
      containerType: ContainerType.CMAF,
      includeIframeOnlyStreams: props.includeIframeOnlyStreams,
      scteFilter: props.scteFilter,
      scteInSegments: props.scteInSegments,
      segmentDuration: props.duration,
      segmentName: props.name,
      encryption: props.encryption,
    };
  }

  /**
   * Create an ISM (Microsoft Smooth Streaming) segment configuration.
   *
   * Use this for endpoints with ContainerType.ISM.
   */
  public static ism(props: IsmSegmentProps = {}): SegmentConfiguration {
    return {
      containerType: ContainerType.ISM,
      includeIframeOnlyStreams: props.includeIframeOnlyStreams,
      segmentDuration: props.duration,
      segmentName: props.name,
      encryption: props.encryption,
    };
  }
}

abstract class OriginEndpointBase extends Resource implements IOriginEndpoint, IOriginEndpointRef {
  /**
   * Creates an OriginEndpoint construct that represents an external (imported) Origin Endpoint.
   */
  public static fromOriginEndpointAttributes(scope: Construct, id: string, attrs: OriginEndpointAttributes): IOriginEndpoint {
    class Import extends OriginEndpointBase implements IOriginEndpoint {
      protected hlsManifests: CfnOriginEndpoint.HlsManifestConfigurationProperty[] = [];
      protected llHlsManifests: CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty[] = [];
      protected dashManifests: CfnOriginEndpoint.DashManifestConfigurationProperty[] = [];
      protected mssManifests: CfnOriginEndpoint.MssManifestConfigurationProperty[] = [];
      protected segment?: SegmentConfiguration | undefined;
      public readonly policy = undefined;
      public readonly channelGroupName = attrs.channelGroupName;
      public readonly channelName = attrs.channelName;
      public readonly originEndpointName = attrs.originEndpointName;
      protected autoCreatePolicy = false;
      public readonly originEndpointArn = Stack.of(this).formatArn({
        partition: 'aws',
        service: 'mediapackagev2',
        resource: `channelGroup/${attrs.channelGroupName}/channel/${this.channelName}/originEndpoint`,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
        resourceName: this.originEndpointName,
      });
    }

    return new Import(scope, id);
  }

  public abstract readonly channelGroupName: string;
  public abstract readonly channelName: string;
  public abstract readonly originEndpointName: string;
  public abstract readonly originEndpointArn: string;

  /**
   * A reference to this Origin Endpoint resource.
   * Required by the auto-generated IOriginEndpointRef interface.
   */
  public get originEndpointRef(): OriginEndpointReference {
    return {
      originEndpointArn: this.originEndpointArn,
    };
  }

  protected abstract hlsManifests: CfnOriginEndpoint.HlsManifestConfigurationProperty[];
  protected abstract llHlsManifests: CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty[];
  protected abstract dashManifests: CfnOriginEndpoint.DashManifestConfigurationProperty[];
  protected abstract mssManifests: CfnOriginEndpoint.MssManifestConfigurationProperty[];
  protected abstract segment?: SegmentConfiguration;
  /**
   * The resource policy associated with this origin endpoint.
   *
   * If `autoCreatePolicy` is true, an `OriginEndpointPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  public abstract policy?: OriginEndpointPolicy;

  /**
   * Indicates if an origin endpoint resource policy should automatically be created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  /**
   * CDN authorization configuration to be applied when the policy is created.
   */
  private cdnAuthConfig?: CdnAuthConfiguration;

  /**
   * Configure origin endpoint policy.
   *
   * You can only add 1 OriginEndpointPolicy to an OriginEndpoint.
   * If you have already defined one, it will append to the policy already created.
   *
   * @param statement - The policy statement to add
   * @param cdnAuth - Optional CDN authorization configuration. If provided, the policy will be
   *                  created with CDN authentication enabled using secrets from AWS Secrets Manager.
   *                  If cdnAuth is provided multiple times, only the first configuration is used.
   */
  public addToResourcePolicy(statement: PolicyStatement, cdnAuth?: CdnAuthConfiguration): AddToResourcePolicyResult {
    // Store CDN auth config if provided (only if not already set)
    if (cdnAuth && !this.cdnAuthConfig) {
      this.cdnAuthConfig = cdnAuth;
    }

    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new OriginEndpointPolicy(this, 'Policy', {
        originEndpoint: this,
        cdnAuth: this.cdnAuthConfig,
      });
    }

    if (this.policy) {
      this.policy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.policy };
    }

    return { statementAdded: false };
  }

  /**
   * Validate and modify Segment configuration for endpoint.
   */
  protected segmentValidation(segmentContainerType: ContainerType, segment?: SegmentConfiguration): CfnOriginEndpoint.SegmentProperty | undefined {
    if (segment?.segmentDuration && (segment.segmentDuration?.toSeconds() < 1 || segment.segmentDuration?.toSeconds() > 30)) {
      throw new ValidationError('Segment Duration needs to be between 1-30 seconds.', this);
    }

    if (segmentContainerType != ContainerType.TS && (segment?.tsIncludeDvbSubtitles || segment?.tsUseAudioRenditionGroup)) {
      throw new ValidationError('Disable TS Segment options for DvbSubtitles and AudioRenditionGroups when using CMAF.', this);
    }

    return {
      includeIframeOnlyStreams: segment?.includeIframeOnlyStreams,
      segmentDurationSeconds: segment?.segmentDuration?.toSeconds(),
      segmentName: segment?.segmentName,
      tsIncludeDvbSubtitles: segment?.tsIncludeDvbSubtitles,
      tsUseAudioRenditionGroup: segment?.tsUseAudioRenditionGroup,
      scte: (segment?.scteFilter || segment?.scteInSegments) ? {
        scteFilter: segment?.scteFilter,
        scteInSegments: segment?.scteInSegments,
      } : undefined,
      encryption: segment?.encryption?._bind(this),
    };
  }

  /**
   * Create a CloudWatch metric.
   *
   * @param metricName name of the metric.
   * @param props metric options.
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      metricName,
      namespace: 'AWS/MediaPackage',
      dimensionsMap: {
        ChannelGroup: this.channelGroupName,
        Channel: this.channelName,
        OriginEndpoint: this.originEndpointName,
      },
      ...props,
    }).attachTo(this);
  }

  /**
   * Returns Metric for Ingress Bytes
   *
   * @default - sum over 60 seconds
   */
  public metricIngressBytes(props?: MetricOptions): Metric {
    return this.metric('IngressBytes', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.BYTES,
      ...props,
    });
  }

  /**
   * Returns Metric for Egress Bytes
   *
   * @default - sum over 60 seconds
   */
  public metricEgressBytes(props?: MetricOptions): Metric {
    return this.metric('EgressBytes', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.BYTES,
      ...props,
    });
  }

  /**
   * Returns Metric for Ingress response time
   *
   * @default - average over 60 seconds
   */
  public metricIngressResponseTime(props?: MetricOptions): Metric {
    return this.metric('IngressResponseTime', {
      statistic: 'avg',
      period: Duration.seconds(60),
      unit: Unit.MILLISECONDS,
      ...props,
    });
  }

  /**
   * Returns Metric for Egress Response time
   *
   * @default - average over 60 seconds
   */
  public metricEgressResponseTime(props?: MetricOptions): Metric {
    return this.metric('EgressResponseTime', {
      statistic: 'avg',
      period: Duration.seconds(60),
      unit: Unit.MILLISECONDS,
      ...props,
    });
  }

  /**
   * Returns Metric for Egress Request Count
   *
   * @default - sum over 60 seconds
   */
  public metricEgressRequestCount(props?: MetricOptions): Metric {
    return this.metric('EgressRequestCount', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.COUNT,
      ...props,
    });
  }

  /**
   * Returns Metric for Ingress Request Count
   *
   * @default - sum over 60 seconds
   */
  public metricIngressRequestCount(props?: MetricOptions): Metric {
    return this.metric('IngressRequestCount', {
      statistic: 'sum',
      period: Duration.seconds(60),
      unit: Unit.COUNT,
      ...props,
    });
  }
}

/**
 * Defines an AWS Elemental MediaPackage V2 Origin Endpoint
 */
@propertyInjectable
export class OriginEndpoint extends OriginEndpointBase implements IOriginEndpoint {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-mediapackagev2-alpha.OriginEndpoint';

  public readonly channelGroupName: string;
  public readonly channelName: string;
  public readonly originEndpointName: string;
  public readonly originEndpointArn: string;

  /**
   * The timestamp of the creation of the origin endpoint.
   */
  public readonly createdAt: string;

  /**
   * The timestamp of the modification of the origin endpoint.
   */
  public readonly modifiedAt: string;

  /**
   * Array containing Low Latency HLS Manifests created by the OriginEndpoint.
   */
  public readonly lowLatencyHlsManifestUrls: string[];

  /**
   * Array containing HLS Manifests created by the OriginEndpoint.
   */
  public readonly hlsManifestUrls: string[];

  /**
   * Array containing DASH Manifests created by the OriginEndpoint.
   */
  public readonly dashManifestUrls: string[];
  /**
   * Array containing MSS Manifests created by the OriginEndpoint.
   */
  public readonly mssManifestUrls: string[];
  /**
   * The resource policy associated with this origin endpoint.
   *
   * If `autoCreatePolicy` is true, an `OriginEndpointPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  public policy?: OriginEndpointPolicy;
  protected autoCreatePolicy = true;
  protected hlsManifests: CfnOriginEndpoint.HlsManifestConfigurationProperty[] = [];
  protected llHlsManifests: CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty[] = [];
  protected dashManifests: CfnOriginEndpoint.DashManifestConfigurationProperty[] = [];
  protected mssManifests: CfnOriginEndpoint.MssManifestConfigurationProperty[] = [];
  protected segment?: SegmentConfiguration;

  constructor(scope: Construct, id: string, props: OriginEndpointProps) {
    super(scope, id, {
      physicalName: props?.originEndpointName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, {
          maxLength: 256,
        }),
      }),
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Validate originEndpointName if provided
    if (props.originEndpointName != null) {
      if (props.originEndpointName.length < 1 || props.originEndpointName.length > 256) {
        throw new ValidationError('Origin endpoint name must be between 1 and 256 characters in length.', this);
      }
      if (!props.originEndpointName.match(/^[a-zA-Z0-9_-]+$/)) {
        throw new ValidationError('Origin endpoint name must only contain alphanumeric characters, hyphens, and underscores.', this);
      }
    }

    // Validate description if provided
    if (props.description && props.description.length > 1024) {
      throw new ValidationError('Origin endpoint description must not exceed 1024 characters.', this);
    }

    this.segment = props.segment;

    // Get container type from segment
    const containerType = props.segment.containerType;

    if (props?.startoverWindow && (props.startoverWindow.toSeconds() < 60 || props.startoverWindow.toSeconds() > 1209600)) {
      throw new ValidationError('Startover Window needs to be between 60-1209600 seconds.', this);
    }

    props.manifests.forEach(manifest => {
      manifest._bind({
        hlsManifests: this.hlsManifests,
        llHlsManifests: this.llHlsManifests,
        dashManifests: this.dashManifests,
        mssManifests: this.mssManifests,
        segment: props.segment,
      });
    });

    // Validate manifest and container type compatibility
    if (this.mssManifests.length > 0 && containerType !== ContainerType.ISM) {
      throw new ValidationError('MSS manifests require ISM container type. Use Segment.ism() for MSS manifests.', this);
    }

    if (this.dashManifests.length > 0 && containerType !== ContainerType.CMAF) {
      throw new ValidationError('DASH manifests require CMAF container type. Use Segment.cmaf() for DASH manifests.', this);
    }

    if ((this.hlsManifests.length > 0 || this.llHlsManifests.length > 0) && containerType === ContainerType.ISM) {
      throw new ValidationError('HLS and Low Latency HLS manifests are not supported with ISM container type. Use Segment.cmaf() or Segment.ts() for HLS manifests.', this);
    }

    // Validate DRM signalling requires encryption
    if (this.dashManifests.some(m => m.drmSignaling) && !props.segment.encryption) {
      throw new ValidationError('DRM signalling requires encryption to be configured on the endpoint.', this);
    }

    const origin = new CfnOriginEndpoint(this, 'Resource', {
      channelName: props.channel.channelName,
      channelGroupName: props.channel.channelGroupName,
      originEndpointName: this.physicalName,
      description: props.description,
      tags: props?.tags ? renderTags(props.tags) : undefined,
      hlsManifests: Lazy.any({ produce: () => this.hlsManifests }, { omitEmptyArray: true }),
      lowLatencyHlsManifests: Lazy.any({ produce: () => this.llHlsManifests }, { omitEmptyArray: true }),
      dashManifests: Lazy.any({ produce: () => this.dashManifests }, { omitEmptyArray: true }),
      mssManifests: Lazy.any({ produce: () => this.mssManifests }, { omitEmptyArray: true }),
      containerType: containerType,
      startoverWindowSeconds: props.startoverWindow?.toSeconds(),
      segment: this.segmentValidation(containerType, props.segment),
      forceEndpointErrorConfiguration: props.forceEndpointConfigurationConditions ? {
        endpointErrorConditions: props.forceEndpointConfigurationConditions,
      }: undefined,
    });

    // The channelName/channelGroupName are rendered as literal strings (not CFN Refs), so
    // CloudFormation cannot infer the dependency. We add direct CfnResource-level DependsOn
    // to guarantee deploy ordering without triggering CDK's subtree-level cycle detection.
    // For imported constructs, defaultChild is undefined (no CFN resource to order against).
    const encryptionRole = props.segment.encryption?._getRole();
    if (encryptionRole) origin.node.addDependency(encryptionRole);
    const encryptionCert = props.segment.encryption?._getCertificate();
    if (encryptionCert) origin.node.addDependency(encryptionCert);
    const channelCfn = props.channel.node.defaultChild as CfnResource | undefined;
    if (channelCfn && CfnResource.isCfnResource(channelCfn)) {
      origin.addDependency(channelCfn);
    }
    const groupCfn = props.channel.channelGroup?.node.defaultChild as CfnResource | undefined;
    if (groupCfn && CfnResource.isCfnResource(groupCfn)) {
      origin.addDependency(groupCfn);
    }

    this.lowLatencyHlsManifestUrls = origin.attrLowLatencyHlsManifestUrls;
    this.hlsManifestUrls = origin.attrHlsManifestUrls;
    this.dashManifestUrls = origin.attrDashManifestUrls;
    this.mssManifestUrls = origin.attrMssManifestUrls;
    this.createdAt = origin.attrCreatedAt;
    this.modifiedAt = origin.attrModifiedAt;
    this.channelGroupName = origin.channelGroupName;
    this.channelName = origin.channelName;
    this.originEndpointName = origin.originEndpointName;
    this.originEndpointArn = origin.attrArn;

    origin.applyRemovalPolicy(props?.removalPolicy ?? RemovalPolicy.DESTROY);
  }
}
