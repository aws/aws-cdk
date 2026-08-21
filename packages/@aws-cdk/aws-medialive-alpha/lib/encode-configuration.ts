import { Token, UnscopedValidationError } from 'aws-cdk-lib';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import type { CfnChannel } from 'aws-cdk-lib/aws-medialive';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { AudioCodecSettings } from './audio-codec-settings';
import type { AudioCodecType } from './audio-codec-settings';
import type { CaptionDestination } from './caption-settings';
import type { VideoCodecSettings, VideoCodecType } from './video-codec-settings';

/**
 * Base interface for an encode configuration (video, audio, or caption).
 *
 * The same EncodeConfiguration instance can be shared across multiple output groups within a channel.
 * The channel automatically deduplicates encode descriptions by name at synth time.
 */
export abstract class EncodeConfiguration {
  /**
   * Create a video encode configuration.
   */
  public static video(props: VideoEncodeProps): EncodeConfiguration {
    return new VideoEncodeConfiguration(props);
  }

  /**
   * Create an audio encode configuration.
   */
  public static audio(props: AudioEncodeProps): EncodeConfiguration {
    return new AudioEncodeConfiguration(props);
  }

  /**
   * Create a caption encode configuration.
   */
  public static caption(props: CaptionEncodeProps): EncodeConfiguration {
    return new CaptionEncodeConfiguration(props);
  }

  /** The unique name for this encode, used to reference it from outputs. */
  public abstract readonly name: string;

  /**
   * Whether this encode has explicit framerate and PAR configured.
   * Required for MediaPackage V2 video outputs.
   * @internal
   */
  public abstract _hasExplicitFramerate(): boolean;

  /** @internal */
  public abstract _bindVideo(): CfnChannel.VideoDescriptionProperty | undefined;
  /** @internal */
  public abstract _bindAudio(): CfnChannel.AudioDescriptionProperty | undefined;
  /** @internal */
  public abstract _bindCaption(): CfnChannel.CaptionDescriptionProperty | undefined;
  /** @internal */
  public abstract _videoCodecType(): VideoCodecType | undefined;
  /** @internal */
  public abstract _audioCodecType(): AudioCodecType | undefined;

  /**
   * Grant the channel role read access to any external files this encode references (e.g. a
   * burn-in caption font in S3). Default is a no-op; caption encodes override it.
   * @internal
   */
  public _grantRead(_role: IRole): void {}

  /**
   * Whether this is an in-band caption encode (burn-in, embedded) that does not produce a
   * separate track. Returns false for non-caption encodes and out-of-band caption types.
   * @internal
   */
  public _isInBandCaption(): boolean {
    return false;
  }

  /**
   * Whether this is an embedded-family caption encode. Only one per output is allowed.
   * @internal
   */
  public _isEmbeddedCaption(): boolean {
    return false;
  }
}

/**
 * How to respond to AFD values in the input stream.
 */
export enum RespondToAfd {
  /** Clip input video based on AFD values */
  RESPOND = 'RESPOND',
  /** Pass AFD values through without clipping */
  PASSTHROUGH = 'PASSTHROUGH',
  /** Ignore AFD values */
  NONE = 'NONE',
}

/**
 * Video scaling behavior.
 */
export enum ScalingBehavior {
  /** May insert black boxes to match output resolution */
  DEFAULT = 'DEFAULT',
  /** Stretch video to fill the output resolution */
  STRETCH_TO_OUTPUT = 'STRETCH_TO_OUTPUT',
  /** Intelligently crop the video to focus on key subjects (9:16 vertical). Requires an Elemental Inference feed on the channel via `inferenceFeed`. Do NOT include `FeedOutput.cropping()` on the feed — MediaLive auto-inserts it. */
  SMART_CROP = 'SMART_CROP',
}

/**
 * Properties for a video encode configuration.
 */
export interface VideoEncodeProps {
  /**
   * A unique name for this video encode.
   */
  readonly name: string;
  /**
   * The width of the output video in pixels. Must be an even number.
   */
  readonly width: number;
  /**
   * The height of the output video in pixels. Must be an even number.
   */
  readonly height: number;
  /**
   * The codec settings for the video encode.
   * @default - service default (no codec settings emitted)
   */
  readonly codecSettings?: VideoCodecSettings;
  /**
   * How to respond to AFD values in the input stream.
   * @default RespondToAfd.NONE
   */
  readonly respondToAfd?: RespondToAfd;
  /**
   * The video scaling behavior.
   * @default ScalingBehavior.DEFAULT
   */
  readonly scalingBehavior?: ScalingBehavior;
  /**
   * The anti-alias filter strength (0-100). 0 is softest, 100 is sharpest.
   * @default 50
   */
  readonly sharpness?: number;
}

/**
 * Audio normalization algorithm.
 */
export enum AudioNormalizationAlgorithm {
  /** CALM Act specification (ITU-R BS.1770-1) */
  ITU_1770_1 = 'ITU_1770_1',
  /** EBU R-128 specification (ITU-R BS.1770-2) */
  ITU_1770_2 = 'ITU_1770_2',
}

/**
 * Audio normalization algorithm control.
 */
export enum AudioNormalizationAlgorithmControl {
  /** Correct the audio using the chosen algorithm */
  CORRECT_AUDIO = 'CORRECT_AUDIO',
  /** Measure audio but do not adjust */
  MEASURE_ONLY = 'MEASURE_ONLY',
}

/**
 * Peak calculation method for audio normalization.
 */
export enum AudioNormalizationPeakCalculation {
  /** Calculate and log the TruePeak for each audio track. */
  TRUE_PEAK = 'TRUE_PEAK',
}

/**
 * Audio normalization settings.
 */
export interface AudioNormalizationSettings {
  /**
   * The normalization algorithm.
   * @default - service default
   */
  readonly algorithm?: AudioNormalizationAlgorithm;
  /**
   * Whether to correct or only measure.
   * @default - service default
   */
  readonly algorithmControl?: AudioNormalizationAlgorithmControl;
  /**
   * The target loudness in LKFS. CALM Act recommends -24, EBU R-128 recommends -23.
   * @default - service default
   */
  readonly targetLkfs?: number;
  /**
   * Whether to use a peak limiter and how to calculate peak levels.
   * @default - service default
   */
  readonly peakCalculation?: AudioNormalizationPeakCalculation;
  /**
   * The peak limiter threshold in dBFS. Only used when peak limiting is enabled.
   * @default - service default
   */
  readonly peakLimiterThreshold?: number;
}

/**
 * An input channel level for audio remixing.
 */
export interface InputChannelLevel {
  /**
   * The index of the input channel to use as a source.
   */
  readonly inputChannel: number;
  /**
   * The remixing gain in dB (-60 to 6).
   * @default 0
   */
  readonly gain?: number;
}

/**
 * A mapping from input channels to an output channel.
 */
export interface AudioChannelMapping {
  /**
   * The index of the output channel being produced.
   */
  readonly outputChannel: number;
  /**
   * The input channels and their gain levels to mix into this output channel.
   */
  readonly inputChannelLevels: InputChannelLevel[];
}

/**
 * Audio remix settings for channel remapping.
 */
export interface RemixSettings {
  /**
   * The channel mappings from input to output.
   */
  readonly channelMappings: AudioChannelMapping[];
  /**
   * The number of input channels.
   * @default - auto-detected
   */
  readonly channelsIn?: number;
  /**
   * The number of output channels. Valid values: 1, 2, 4, 6, 8.
   * @default - auto-detected
   */
  readonly channelsOut?: number;
}

/**
 * CBET insertion behavior when prior encoding is detected on the same layer.
 */
export enum NielsenCbetStepaside {
  /**
   * Existing Nielsen watermarks are removed. New watermarks are inserted throughout the audio.
   */
  DISABLED = 'DISABLED',
  /**
   * Existing Nielsen watermarks are left intact. New watermarks are inserted only in portions
   * of the audio where there are no existing watermarks.
   */
  ENABLED = 'ENABLED',
}

/**
 * Timezone applied to the timestamps in a Nielsen NAES II/NW watermark.
 */
export enum NielsenWatermarkTimezone {
  /** America/Puerto Rico */
  AMERICA_PUERTO_RICO = 'AMERICA_PUERTO_RICO',
  /** US Alaska */
  US_ALASKA = 'US_ALASKA',
  /** US Arizona */
  US_ARIZONA = 'US_ARIZONA',
  /** US Central */
  US_CENTRAL = 'US_CENTRAL',
  /** US Eastern */
  US_EASTERN = 'US_EASTERN',
  /** US Hawaii */
  US_HAWAII = 'US_HAWAII',
  /** US Mountain */
  US_MOUNTAIN = 'US_MOUNTAIN',
  /** US Pacific */
  US_PACIFIC = 'US_PACIFIC',
  /** US Samoa */
  US_SAMOA = 'US_SAMOA',
  /** Coordinated Universal Time */
  UTC = 'UTC',
}

/**
 * Nielsen CBET watermark settings.
 */
export interface NielsenCbetSettings {
  /**
   * The CBET check digit string.
   */
  readonly cbetCheckDigitString: string;
  /**
   * The CBET Source ID (CSID).
   */
  readonly csid: string;
  /**
   * The CBET stepaside behavior when prior encoding is detected.
   * @default - service default
   */
  readonly cbetStepaside?: NielsenCbetStepaside;
}

/**
 * Nielsen NAES II/NW watermark settings.
 */
export interface NielsenNaesIiNwSettings {
  /**
   * The check digit string for the watermark.
   */
  readonly checkDigitString: string;
  /**
   * The Nielsen Source ID (SID).
   */
  readonly sid: number;
  /**
   * The timezone for the timestamps in the watermark.
   * @default - Coordinated Universal Time (UTC)
   */
  readonly timezone?: NielsenWatermarkTimezone;
}

/**
 * Nielsen watermark distribution type.
 */
export enum NielsenDistributionType {
  /** Program content */
  PROGRAM_CONTENT = 'PROGRAM_CONTENT',
  /** Final distributor */
  FINAL_DISTRIBUTOR = 'FINAL_DISTRIBUTOR',
}

/**
 * Nielsen watermark settings for audio.
 */
export interface NielsenWatermarksSettings {
  /**
   * The distribution type for the watermark.
   * @default - service default
   */
  readonly distributionType?: NielsenDistributionType;
  /**
   * Nielsen CBET watermark settings.
   * @default - no CBET watermarks
   */
  readonly cbetSettings?: NielsenCbetSettings;
  /**
   * Nielsen NAES II/NW watermark settings.
   * @default - no NAES II/NW watermarks
   */
  readonly naesIiNwSettings?: NielsenNaesIiNwSettings;
}

/**
 * Audio watermarking settings.
 */
export interface AudioWatermarkSettings {
  /**
   * Nielsen watermark settings.
   * @default - no Nielsen watermarks
   */
  readonly nielsenWatermarks?: NielsenWatermarksSettings;
}

/**
 * Determines how the audio type is signaled in the output.
 */
export enum AudioTypeControl {
  /**
   * If the input contains an ISO 639 audioType it is passed through; otherwise the
   * configured `audioType` is used.
   */
  FOLLOW_INPUT = 'FOLLOW_INPUT',
  /** The configured `audioType` is always used. */
  USE_CONFIGURED = 'USE_CONFIGURED',
}

/**
 * Determines how the audio language code is signaled in the output.
 */
export enum AudioLanguageCodeControl {
  /**
   * If the input contains a language code it is passed through; otherwise the configured
   * `languageCode` is used as a fallback.
   */
  FOLLOW_INPUT = 'FOLLOW_INPUT',
  /** The configured `languageCode` is always used. */
  USE_CONFIGURED = 'USE_CONFIGURED',
}

/**
 * The audio type, as defined in ISO/IEC 13818-1.
 */
export enum AudioType {
  /** Clean effects (no dialogue). */
  CLEAN_EFFECTS = 'CLEAN_EFFECTS',
  /** Hearing impaired. */
  HEARING_IMPAIRED = 'HEARING_IMPAIRED',
  /** Undefined. */
  UNDEFINED = 'UNDEFINED',
  /** Visual impaired commentary. */
  VISUAL_IMPAIRED_COMMENTARY = 'VISUAL_IMPAIRED_COMMENTARY',
}

/**
 * DVB DASH accessibility signaling for an audio output.
 */
export enum DvbDashAccessibility {
  /** Visually impaired. */
  VISUALLY_IMPAIRED = 'DVBDASH_1_VISUALLY_IMPAIRED',
  /** Hard of hearing. */
  HARD_OF_HEARING = 'DVBDASH_2_HARD_OF_HEARING',
  /** Supplemental commentary. */
  SUPPLEMENTAL_COMMENTARY = 'DVBDASH_3_SUPPLEMENTAL_COMMENTARY',
  /** Director's commentary. */
  DIRECTORS_COMMENTARY = 'DVBDASH_4_DIRECTORS_COMMENTARY',
  /** Educational notes. */
  EDUCATIONAL_NOTES = 'DVBDASH_5_EDUCATIONAL_NOTES',
  /** Main program. */
  MAIN_PROGRAM = 'DVBDASH_6_MAIN_PROGRAM',
  /** Clean feed. */
  CLEAN_FEED = 'DVBDASH_7_CLEAN_FEED',
}

/**
 * A DASH role to assign to an audio output (used when the output carries DVB DASH accessibility
 * signaling).
 */
export enum AudioDashRole {
  /** Alternate. */
  ALTERNATE = 'ALTERNATE',
  /** Commentary. */
  COMMENTARY = 'COMMENTARY',
  /** Description. */
  DESCRIPTION = 'DESCRIPTION',
  /** Dub. */
  DUB = 'DUB',
  /** Emergency. */
  EMERGENCY = 'EMERGENCY',
  /** Enhanced audio intelligibility. */
  ENHANCED_AUDIO_INTELLIGIBILITY = 'ENHANCED-AUDIO-INTELLIGIBILITY',
  /** Karaoke. */
  KARAOKE = 'KARAOKE',
  /** Main. */
  MAIN = 'MAIN',
  /** Supplementary. */
  SUPPLEMENTARY = 'SUPPLEMENTARY',
}

/**
 * Properties for an audio encode configuration.
 */
export interface AudioEncodeProps {
  /**
   * A unique name for this audio encode.
   */
  readonly name: string;
  /**
   * The name of the audio selector in the input to use as the source. Must match the `name` of an
   * `AudioSelector` on the input attachment. When omitted, MediaLive uses the input's default audio.
   * @default - the input's default audio
   */
  readonly audioSelectorName?: string;
  /**
   * The codec settings for the audio encode.
   * @default - AAC with sensible defaults
   */
  readonly codecSettings?: AudioCodecSettings;
  /**
   * The ISO 639-2 language code for the audio output track (e.g. 'eng', 'spa').
   * @default - follow input
   */
  readonly languageCode?: string;
  /**
   * How the audio language code is signaled in the output. When `FOLLOW_INPUT`, a configured
   * `languageCode` is used only as a fallback when the input has none.
   * @default - USE_CONFIGURED when `languageCode` is set, otherwise FOLLOW_INPUT
   */
  readonly languageCodeControl?: AudioLanguageCodeControl;
  /**
   * The display name for the audio track (e.g. 'English', 'Director Commentary').
   * Used for HLS and MS Smooth outputs.
   * @default - no stream name
   */
  readonly streamName?: string;
  /**
   * Audio normalization settings for loudness correction.
   * @default - no normalization
   */
  readonly audioNormalization?: AudioNormalizationSettings;
  /**
   * The audio type when audioTypeControl is USE_CONFIGURED. The values are defined in ISO-IEC 13818-1.
   * @default - follow input
   */
  readonly audioType?: AudioType;
  /**
   * How the audio type is signaled in the output.
   * @default - USE_CONFIGURED when `audioType` is set, otherwise FOLLOW_INPUT
   */
  readonly audioTypeControl?: AudioTypeControl;
  /**
   * The DASH roles to assign to this audio output. Applies only when the output is configured
   * for DVB DASH accessibility signaling.
   * @default - no DASH roles
   */
  readonly audioDashRoles?: AudioDashRole[];
  /**
   * DVB DASH accessibility signaling for this audio output.
   * @default - no DVB DASH accessibility signaling
   */
  readonly dvbDashAccessibility?: DvbDashAccessibility;
  /**
   * Audio remix settings for channel remapping.
   * @default - no remixing
   */
  readonly remixSettings?: RemixSettings;
  /**
   * Audio watermarking settings (e.g. Nielsen watermarks).
   * @default - no watermarking
   */
  readonly audioWatermarkSettings?: AudioWatermarkSettings;
}

/** @internal */
class VideoEncodeConfiguration extends EncodeConfiguration {
  public readonly name: string;
  private readonly props: VideoEncodeProps;

  constructor(props: VideoEncodeProps) {
    super();
    if (!Token.isUnresolved(props.width) && props.width % 2 !== 0) {
      throw new UnscopedValidationError(lit`VideoWidthEven`, `Video width must be an even number, got ${props.width}.`);
    }
    if (!Token.isUnresolved(props.height) && props.height % 2 !== 0) {
      throw new UnscopedValidationError(lit`VideoHeightEven`, `Video height must be an even number, got ${props.height}.`);
    }
    this.name = props.name;
    this.props = props;
  }

  public _hasExplicitFramerate(): boolean {
    return this.props.codecSettings?._hasExplicitFramerate() ?? false;
  }

  public _bindVideo(): CfnChannel.VideoDescriptionProperty {
    return {
      name: this.name,
      width: this.props.width,
      height: this.props.height,
      respondToAfd: this.props.respondToAfd ?? RespondToAfd.NONE,
      scalingBehavior: this.props.scalingBehavior ?? ScalingBehavior.DEFAULT,
      sharpness: this.props.sharpness ?? 50,
      codecSettings: this.props.codecSettings?._bind(),
    };
  }

  public _bindAudio(): undefined {
    return undefined;
  }

  public _bindCaption(): undefined {
    return undefined;
  }

  public _videoCodecType(): VideoCodecType | undefined {
    return this.props.codecSettings?._codecType;
  }

  public _audioCodecType(): undefined {
    return undefined;
  }
}

/** @internal */
class AudioEncodeConfiguration extends EncodeConfiguration {
  public readonly name: string;
  private readonly props: AudioEncodeProps;

  constructor(props: AudioEncodeProps) {
    super();
    this.name = props.name;
    this.props = props;
  }

  public _hasExplicitFramerate(): boolean {
    return true; // Not applicable for audio
  }

  public _bindVideo(): undefined {
    return undefined;
  }

  public _bindAudio(): CfnChannel.AudioDescriptionProperty {
    const codecSettings = this.props.codecSettings ?? AudioCodecSettings.aac();
    return {
      name: this.name,
      audioSelectorName: this.props.audioSelectorName,
      audioTypeControl: this.props.audioTypeControl
        ?? (this.props.audioType !== undefined ? AudioTypeControl.USE_CONFIGURED : AudioTypeControl.FOLLOW_INPUT),
      languageCode: this.props.languageCode,
      languageCodeControl: this.props.languageCodeControl
        ?? (this.props.languageCode !== undefined ? AudioLanguageCodeControl.USE_CONFIGURED : AudioLanguageCodeControl.FOLLOW_INPUT),
      streamName: this.props.streamName,
      audioType: this.props.audioType,
      audioDashRoles: this.props.audioDashRoles,
      dvbDashAccessibility: this.props.dvbDashAccessibility,
      codecSettings: codecSettings._bind(),
      audioNormalizationSettings: this.props.audioNormalization ? {
        algorithm: this.props.audioNormalization.algorithm,
        algorithmControl: this.props.audioNormalization.algorithmControl,
        targetLkfs: this.props.audioNormalization.targetLkfs,
        peakCalculation: this.props.audioNormalization.peakCalculation,
        peakLimiterThreshold: this.props.audioNormalization.peakLimiterThreshold,
      } : undefined,
      remixSettings: this.props.remixSettings ? {
        channelMappings: this.props.remixSettings.channelMappings.map(m => ({
          outputChannel: m.outputChannel,
          inputChannelLevels: m.inputChannelLevels.map(l => ({
            inputChannel: l.inputChannel,
            gain: l.gain ?? 0,
          })),
        })),
        channelsIn: this.props.remixSettings.channelsIn,
        channelsOut: this.props.remixSettings.channelsOut,
      } : undefined,
      audioWatermarkingSettings: this.props.audioWatermarkSettings ? {
        nielsenWatermarksSettings: this.props.audioWatermarkSettings.nielsenWatermarks ? {
          nielsenDistributionType: this.props.audioWatermarkSettings.nielsenWatermarks.distributionType,
          nielsenCbetSettings: this.props.audioWatermarkSettings.nielsenWatermarks.cbetSettings ? {
            cbetCheckDigitString: this.props.audioWatermarkSettings.nielsenWatermarks.cbetSettings.cbetCheckDigitString,
            cbetStepaside: this.props.audioWatermarkSettings.nielsenWatermarks.cbetSettings.cbetStepaside,
            csid: this.props.audioWatermarkSettings.nielsenWatermarks.cbetSettings.csid,
          } : undefined,
          nielsenNaesIiNwSettings: this.props.audioWatermarkSettings.nielsenWatermarks.naesIiNwSettings ? {
            checkDigitString: this.props.audioWatermarkSettings.nielsenWatermarks.naesIiNwSettings.checkDigitString,
            sid: this.props.audioWatermarkSettings.nielsenWatermarks.naesIiNwSettings.sid,
            timezone: this.props.audioWatermarkSettings.nielsenWatermarks.naesIiNwSettings.timezone,
          } : undefined,
        } : undefined,
      } : undefined,
    };
  }

  public _bindCaption(): undefined {
    return undefined;
  }

  public _videoCodecType(): undefined {
    return undefined;
  }

  public _audioCodecType(): AudioCodecType | undefined {
    const codec = this.props.codecSettings ?? AudioCodecSettings.aac();
    return codec._codecType;
  }
}

/**
 * Whether a caption track implements accessibility features (written descriptions of dialog,
 * music, and sounds). Signaled in HLS and MediaPackage output groups.
 */
export enum CaptionAccessibility {
  /** The captions do not implement accessibility features. */
  DOES_NOT_IMPLEMENT_ACCESSIBILITY_FEATURES = 'DOES_NOT_IMPLEMENT_ACCESSIBILITY_FEATURES',
  /** The captions implement accessibility features. */
  IMPLEMENTS_ACCESSIBILITY_FEATURES = 'IMPLEMENTS_ACCESSIBILITY_FEATURES',
}

/**
 * A DASH role to assign to a captions output (used when the output carries DVB DASH accessibility
 * signaling).
 */
export enum CaptionDashRole {
  /** Alternate. */
  ALTERNATE = 'ALTERNATE',
  /** Caption. */
  CAPTION = 'CAPTION',
  /** Commentary. */
  COMMENTARY = 'COMMENTARY',
  /** Description. */
  DESCRIPTION = 'DESCRIPTION',
  /** Dub. */
  DUB = 'DUB',
  /** Easy reader. */
  EASYREADER = 'EASYREADER',
  /** Emergency. */
  EMERGENCY = 'EMERGENCY',
  /** Forced subtitle. */
  FORCED_SUBTITLE = 'FORCED-SUBTITLE',
  /** Karaoke. */
  KARAOKE = 'KARAOKE',
  /** Main. */
  MAIN = 'MAIN',
  /** Metadata. */
  METADATA = 'METADATA',
  /** Subtitle. */
  SUBTITLE = 'SUBTITLE',
  /** Supplementary. */
  SUPPLEMENTARY = 'SUPPLEMENTARY',
}

/**
 * Properties for a caption encode configuration.
 */
export interface CaptionEncodeProps {
  /**
   * A unique name for this caption encode.
   */
  readonly name: string;
  /**
   * The name of the caption selector in the input to use as the source.
   */
  readonly captionSelectorName: string;
  /**
   * The output caption format. Use the `CaptionDestination` factory methods (e.g.
   * `CaptionDestination.burnIn()`, `.webvtt()`, `.embedded()`).
   */
  readonly destination: CaptionDestination;
  /**
   * The ISO 639-2 language code for the captions (e.g. 'eng', 'spa').
   * @default - no language code
   */
  readonly languageCode?: string;
  /**
   * Human-readable description of the captions (e.g. 'English', 'Spanish').
   * @default - no language description
   */
  readonly languageDescription?: string;
  /**
   * Whether this caption track implements accessibility features.
   * @default - The captions do not implement accessibility features
   */
  readonly accessibility?: CaptionAccessibility;
  /**
   * The DASH roles to assign to this captions output. Applies only when the output is configured
   * for DVB DASH accessibility signaling.
   * @default - no DASH roles
   */
  readonly captionDashRoles?: CaptionDashRole[];
  /**
   * DVB DASH accessibility signaling for this captions output.
   * @default - no DVB DASH accessibility signaling
   */
  readonly dvbDashAccessibility?: DvbDashAccessibility;
}

/** @internal */
class CaptionEncodeConfiguration extends EncodeConfiguration {
  public readonly name: string;
  private readonly props: CaptionEncodeProps;

  constructor(props: CaptionEncodeProps) {
    super();
    this.name = props.name;
    this.props = props;
  }

  public _hasExplicitFramerate(): boolean {
    return true; // Not applicable for captions
  }

  public _bindVideo(): undefined {
    return undefined;
  }

  public _bindAudio(): undefined {
    return undefined;
  }

  public _bindCaption(): CfnChannel.CaptionDescriptionProperty {
    return {
      name: this.name,
      captionSelectorName: this.props.captionSelectorName,
      destinationSettings: this.props.destination._bind(),
      languageCode: this.props.languageCode,
      languageDescription: this.props.languageDescription,
      accessibility: this.props.accessibility ?? CaptionAccessibility.DOES_NOT_IMPLEMENT_ACCESSIBILITY_FEATURES,
      captionDashRoles: this.props.captionDashRoles,
      dvbDashAccessibility: this.props.dvbDashAccessibility,
    };
  }

  public _videoCodecType(): undefined {
    return undefined;
  }

  public _audioCodecType(): undefined {
    return undefined;
  }

  public override _grantRead(role: IRole): void {
    this.props.destination._grantRead(role);
  }

  public override _isInBandCaption(): boolean {
    return this.props.destination._isInBand();
  }

  public override _isEmbeddedCaption(): boolean {
    return this.props.destination._isEmbedded();
  }
}
